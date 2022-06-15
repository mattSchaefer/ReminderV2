class ReminderTimesController < ApplicationController
  before_action :set_reminder_time, only: %i[ show edit update destroy ]

  # GET /reminder_times or /reminder_times.json
  def index
    @reminder_times = ReminderTime.all
    render json: {reminder_times: @reminder_times, status: 200}
  end

  # GET /reminder_times/1 or /reminder_times/1.json
  def show
  end

  # GET /reminder_times/new
  def new
    @reminder_time = ReminderTime.new
  end

  # GET /reminder_times/1/edit
  def edit
  end

  # POST /reminder_times or /reminder_times.json
  def create
    @reminder_time = ReminderTime.new(reminder_time_params)

    respond_to do |format|
      if @reminder_time.save
        format.html { redirect_to reminder_time_url(@reminder_time), notice: "Reminder time was successfully created." }
        format.json { render :show, status: :created, location: @reminder_time }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @reminder_time.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /reminder_times/1 or /reminder_times/1.json
  def update
    respond_to do |format|
      if @reminder_time.update(reminder_time_params)
        format.html { redirect_to reminder_time_url(@reminder_time), notice: "Reminder time was successfully updated." }
        format.json { render :show, status: :ok, location: @reminder_time }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @reminder_time.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /reminder_times/1 or /reminder_times/1.json
  def destroy
    @reminder_time.destroy

    respond_to do |format|
      format.html { redirect_to reminder_times_url, notice: "Reminder time was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_reminder_time
      @reminder_time = ReminderTime.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def reminder_time_params
      params.require(:reminder_time).permit(:time)
    end
end
