require "application_system_test_case"

class ReminderTimesTest < ApplicationSystemTestCase
  setup do
    @reminder_time = reminder_times(:one)
  end

  test "visiting the index" do
    visit reminder_times_url
    assert_selector "h1", text: "Reminder Times"
  end

  test "creating a Reminder time" do
    visit reminder_times_url
    click_on "New Reminder Time"

    fill_in "Time", with: @reminder_time.time
    click_on "Create Reminder time"

    assert_text "Reminder time was successfully created"
    click_on "Back"
  end

  test "updating a Reminder time" do
    visit reminder_times_url
    click_on "Edit", match: :first

    fill_in "Time", with: @reminder_time.time
    click_on "Update Reminder time"

    assert_text "Reminder time was successfully updated"
    click_on "Back"
  end

  test "destroying a Reminder time" do
    visit reminder_times_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Reminder time was successfully destroyed"
  end
end
