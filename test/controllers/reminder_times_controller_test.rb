require "test_helper"

class ReminderTimesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @reminder_time = reminder_times(:one)
  end

  test "should get index" do
    get reminder_times_url
    assert_response :success
  end

  test "should get new" do
    get new_reminder_time_url
    assert_response :success
  end

  test "should create reminder_time" do
    assert_difference('ReminderTime.count') do
      post reminder_times_url, params: { reminder_time: { time: @reminder_time.time } }
    end

    assert_redirected_to reminder_time_url(ReminderTime.last)
  end

  test "should show reminder_time" do
    get reminder_time_url(@reminder_time)
    assert_response :success
  end

  test "should get edit" do
    get edit_reminder_time_url(@reminder_time)
    assert_response :success
  end

  test "should update reminder_time" do
    patch reminder_time_url(@reminder_time), params: { reminder_time: { time: @reminder_time.time } }
    assert_redirected_to reminder_time_url(@reminder_time)
  end

  test "should destroy reminder_time" do
    assert_difference('ReminderTime.count', -1) do
      delete reminder_time_url(@reminder_time)
    end

    assert_redirected_to reminder_times_url
  end
end
