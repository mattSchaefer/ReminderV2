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
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
