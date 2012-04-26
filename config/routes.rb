Mixture::Application.routes.draw do
  namespace :api do
    namespace :v0 do

      # Mixes
      resources :mixes, only: [:create, :show, :update] do
        collection do
          get 'popular'
          get 'popular/page/:page', action: :popular

          get 'recent'
          get 'recent/page/:page', action: :recent

          get 'search/:query', action: :search
          get 'search/:query/page/:page', action: :search
        end

        member do
          put 'played', action: :played
          get 'stream', action: :stream
        end
      end

      # Collections
      resources :collections, controller: 'mix_collections', only: [:index, :show] do
        member do
          get 'years'
        end

        collection do
          get 'all'
          get 'page/:page', action: :index
        end

        resources :mixes, only: [:index] do
          get 'page/:page', action: :index, on: :collection
        end
      end

      # Performers
      resources :performers, only: [] do
        get 'search', :action => :search, :on => :collection
      end

      # Users
      resources :users, only: [:destroy]
      match "auth/:provider/callback" => "users#create"

      resource :u, controller: 'u', only: [:show] do
        resource :favorites, only: [] do
          collection do
            get '', action: :index
            get 'page/:page', action: :index
          end
          member do
            post ':mix_id', action: :create
            delete ':mix_id', action: :destroy
          end
        end
      end
    end
  end

  namespace :admin do
    root to: redirect('/admin/mixes')
    resources :mixes
    resources :mix_collections
    resources :performers
  end

  get 'search/:query', to: 'mixture#index'
  get 'recent', to: 'mixture#index'
  get 'popular', to: 'mixture#index'
  get 'u/favorites', to: 'mixture#index'
  get 'm/:id', to: 'mixes#show'
  get 'collections', to: 'mixture#index'
  get 'ios', to: 'mixture#index'
  get 'c/:collection_id', to: 'mixture#index'
  root to: 'mixture#index'
end
