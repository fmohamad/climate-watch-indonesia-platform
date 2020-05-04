class PolicyCategory < ApplicationRecord
  include translates

  translate :name, i18n: :value_category

  validates :name, presence: true, uniqueness: true

  def code
    Code.create(read_attribute(:name))
  end
end
