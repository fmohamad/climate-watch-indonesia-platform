class EmissionProjectionModel < ApplicationRecord
  validates_presence_of :name, :code
  validates :code, uniqueness: true
end
