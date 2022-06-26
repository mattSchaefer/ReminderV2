# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_06_20_225838) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "reminder_times", force: :cascade do |t|
    t.time "time"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "reminder_time_string"
  end

  create_table "reminder_user_notification_stagers", force: :cascade do |t|
    t.bigint "reminder_user_id"
    t.date "date"
    t.time "time"
    t.boolean "notification_sent"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["reminder_user_id"], name: "index_reminder_user_notification_stagers_on_reminder_user_id"
  end

  create_table "reminder_users", force: :cascade do |t|
    t.integer "reminder_id"
    t.integer "user_id"
    t.time "time"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "reminder_time_id"
    t.index ["reminder_time_id"], name: "index_reminder_users_on_reminder_time_id"
  end

  create_table "reminders", force: :cascade do |t|
    t.string "reminder_type"
    t.text "text_body"
    t.integer "max_per_day"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "phone"
    t.string "password_digest"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "activated"
    t.string "activation_token"
    t.datetime "activation_sent_at"
    t.string "reset_email_token"
    t.datetime "reset_email_sent_at"
    t.string "unconfirmed_email"
    t.string "reset_phone_token"
    t.datetime "reset_phone_sent_at"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.string "carrier"
    t.string "timezone"
    t.string "unconfirmed_phone"
  end

  add_foreign_key "reminder_users", "reminder_times"
end
