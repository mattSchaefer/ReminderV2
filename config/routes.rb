Rails.application.routes.draw do
  resources :reminder_times
  root 'homepage#index'
  resource :users
  resource :reminders
  resource :reminder_users
  post 'login', to: 'auth#login'
  post 'logout', to: 'auth#logout'
  post 'users/activate', to: 'users#activate_account'
  post 'get_user_subscriptions', to: 'reminder_users#get_reminders_for_user'
  post 'change_user_subscriptions', to: 'reminder_users#update_schedule_for_user_reminders'
  post 'users/set_unconfirmed_email', to: 'users#set_unconfirmed_email'
  post 'users/confirm_unconfirmed_email', to: 'users#confirm_unconfirmed_email'
  post 'users/set_unconfirmed_phone', to: 'users#set_unconfirmed_phone'
  post 'users/confirm_unconfirmed_phone', to: 'users#confirm_unconfirmed_phone'
  post 'users/change_password', to: 'users#reset_via_old_password'
  post 'users/forgot_password', to: 'users#forgot_password'
  post 'users/reset_password', to: 'users#reset_via_token'
  post 'users/change_carrier', to: 'users#change_carrier'
  post 'users/change_timezone', to: 'users#change_timezone'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
