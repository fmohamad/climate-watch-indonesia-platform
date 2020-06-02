module  Api
  module V1
    module Province
      class PoliciesController < ApiController
        before_action :fetch_values, only: :policy

        ProvincePolicy = Struct.new(
          :policies,
          :sectors,
          :locations
        )

        def index
          province_policies = ProvincePolicy.new(
            fetch_policies,
            fetch_sectors,
            fetch_locations
          )

          respond_to do |format|
            format.json do
              render json: province_policies,
                each_serializer: Api::V1::Province::PolicySerializer
            end
          end
        end

        private

        def location
          params[:location]
        end

        def sections
          params[:sections]&.split(',')
        end

        def selected_model
          params[:code]&.split('-')&.last
        end

        def fetch_policies
          policies = ::Policy.all
          policies = policies.where(section: sections) if sections
          policies.map do |policy|
            {
              id: policy.id,
              section: policy.section,
              code: policy.code,
              name: policy.name,
              unit: policy.unit,
              description: policy.description,
              override: true
            }
          end
        end

        def fetch_sectors
          ::PolicyCategory.where(id: category_ids).map do |category|
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
          locations = locations.where(location_member: { member_id: province.id })
          locations.map do |loc|
            {
              id: loc.id,
              iso_code3: loc.iso_code3,
              name: loc.wri_standard_name
            }
          end
        end

        def fetch_values
          policies = ::Policy.where(section: sections) if sections
          values = ::PolicyValue.includes(:location, :policy, :category)
          values = values.where(locations:  { iso_code: location }) if location
          values = values.where(policies: { id: policies.pluck(:id) })
        end

        def category_ids
          fetch_values.pluck(:category_id).compact.uniq
        end

      end
    end
  end
end
