module Api
  module V1
    module Province
      class EconomyMetadataSerializer < ActiveModel::Serializer
        attribute :indicators
        attribute :sectors
        attribute :locations
      end
    end
  end
end
