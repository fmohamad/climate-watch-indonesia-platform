HistoricalEmissions::Record.class_eval do
  belongs_to :metric, class_name: 'HistoricalEmissions::Metric'
  belongs_to :category, class_name: 'HistoricalEmissions::Category'
  belongs_to :sub_category, class_name: 'HistoricalEmissions::SubCategory'
end
