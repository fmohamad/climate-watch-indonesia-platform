module Api
  module V1
    module Province
      class EconomiesController < ApiController
        EconomiesMetadata = Struct.new(
          :indicators,
          :sectors,
          :locations
        )

        def meta
          economies_metadata = EconomiesMetadata.new(
            fetch_meta_indicators,
            fetch_meta_sectors,
            fetch_locations
          )

          respond_to do |format|
            format.json do
              render json: economies_metadata,
                each_serializer: Api::V1::Province::EconomyMetadataSerializer
            end
          end
        end

        private

        def location
          params[:location]
        end

        def codes
          params[:code]&.split(',')
        end

        def sections
          params[:section]&.split(',')
        end

        def fetch_meta_indicators
          indicators = ::Indicator.all
          indicators = indicators.where(section: sections) if sections
          indicators.map do |indicator|
            {
              id: indicator.id,
              section: indicator.section,
              code: indicator.code,
              name: indicator.name,
              unit: indicator.unit 
            }
          end
        end

        def fetch_meta_sectors
          ::IndicatorCategory.where(id: category_ids).map do |category|
            {
              id: category.id,
              name: category.name,
              code: category.code
            }
          end
        end

        def fetch_locations
          province = ::Location.find_by(iso_code3: location)
          locations = ::Location.includes(:location_members)
          locations = locations.where(location_members: { member_id: province.id})
          locations.map do |loc|
            {
              id: loc.id,
              iso_code3: loc.iso_code3,
              name: loc.wri_standard_name
            }
          end
        end

        def fetch_values
          values = ::IndicatorValue.includes(:location, :indicator, :category)
          values = values.where(locations: {iso_code3: location}) if location
          values = values.where(indicators: {code: codes}) if codes
        end
        
        def category_ids
          fetch_values.pluck(:category_id).uniq
        end
      end
    end
  end
end
