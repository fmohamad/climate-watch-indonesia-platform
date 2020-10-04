class OnlyPages < ActiveAdmin::AuthorizationAdapter
  def authorized?(action, subject = nil)
    case subject 
    when ActiveAdmin::Page
      subject.namespace.name == :admin &&
        if subject.name == "Dashboard"
          action == :read &&
            subject.name == "Dashboard" &&
            user.role == "superuser" || user.role == "admin" || user.role == "admin_wp"
        elsif subject.name == "Translations"
          if action == :read
            action == :read &&
            subject.name == "Translations" &&
            user.role == "superuser" || user.role == "admin"
          elsif action == :update
            action == :update &&
            subject.name == "Translations" &&
            user.role == "superuser" || user.role == "admin"
          end
        elsif platform_west_papua(subject)
          if action == :read
            action == :read &&
            platform_west_papua(subject) &&
            user.role == "superuser" || user.role == "admin" || user.role == "admin_wp"
          elsif action == :import_worker
            action == :import_worker &&
            platform_west_papua(subject) &&
            user.role == "superuser" || user.role == "admin" || user.role == "admin_wp"
          end
        elsif platform_indonesia(subject)
          if action == :read
            action == :read &&
              platform_indonesia(subject) &&
              user.role == "superuser" || user.role == "admin"
          elsif action == :import_worker
            action == :import_worker &&
              platform_indonesia(subject) &&
              user.role == "superuser" || user.role == "admin"
          end
        end
    when normalized(AdminUser)
      if action == :read || action == :create || action == :update || action == :destroy
        user.role == "superuser"
      else
        false
      end
    else
      false
    end
  end

  private

  def platform_indonesia(subject)
    subject.name == "Indonesia Platform Commitment Timeline" || subject.name == "Indonesia Platform Data Translations" || subject.name == "Indonesia Platform Emission Activities" || subject.name == "Indonesia Platform Emission Projections" || subject.name == "Indonesia Platform Emission Targets" || 
    subject.name == "Indonesia Platform Funding" || subject.name == "Indonesia Platform Historical Emissions" || subject.name == "Indonesia Platform Indicators" || subject.name == "Indonesia Platform Locations" || subject.name == "Indonesia Platform Locations Members" || 
    subject.name == "Indonesia Platform Metadata" || subject.name == "Indonesia Platform Province Plans"
  end

  def platform_west_papua(subject)
    subject.name == "Indonesia Platform West Papua Indicators" || subject.name == "Indonesia Platform West Papua Locations" || 
    subject.name == "Indonesia Platform West Papua Locations Members" || subject.name == "Indonesia Platform West Papua Policies"
  end
end