class CreateIndicatorCategorizations < ActiveRecord::Migration[5.2]
  def change
    create_table :indicator_categorizations do |t|
      t.string :name, null: false
      t.jsonb :translations, default: {}
      t.timestamps
    end
    add_index :indicator_categorizations, :name, unique: true
    add_reference :indicator_categories,
                  :categorization,
                  foreign_key: { to_table: :indicator_categorizations, on_delete: :cascade }
  end
end
