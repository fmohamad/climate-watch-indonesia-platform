# == Schema Information
#
# Table name: historical_emissions_category
#
#  id   :bigint(8)        not null, primary key
#  name :string           not null
#
# Indexes
#
#

module HistoricalEmissions
  class Category < ApplicationRecord
    include Translate

    translates :name, i18n: :category

    validates_presence_of :name

    def code
      Code.create(read_attribute(:name))
    end
  end
end
