module Api
  module V1
    module Province
      class PolicySerializer < ActiveModel::Serializer
        attribute :policies
        attribute :sectors
        attribute :locations
      end
    end
  end
end
