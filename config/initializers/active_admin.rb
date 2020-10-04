ActiveAdmin.setup do |config|
  config.site_title = 'Climate Watch Indonesia'
  config.authentication_method = :authenticate_admin_user!
  config.authorization_adapter = "OnlyPages"

  config.current_user_method = :current_admin_user

  config.logout_link_path = :destroy_admin_user_session_path
  config.comments = false

  config.batch_actions = true

  config.localize_format = :long

  config.namespace :admin do |admin|
    admin.build_menu do |menu|
      menu.add label: 'Dashboard', priority: 1
      menu.add label: 'Indonesia Platform', if: proc{ current_admin_user.role == 'superuser' || current_admin_user.role == 'admin' }, priority: 3
      menu.add label: 'West Papua Platform', if: proc{ current_admin_user.role == 'superuser' || current_admin_user.role == 'admin' || current_admin_user.role == 'admin_wp' }, priority: 4
    end
  end
end
