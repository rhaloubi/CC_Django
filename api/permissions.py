from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow GET requests for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Check if user is admin
        if request.user.is_staff:
            return True
            
        # Check if user is the owner
        return obj.user == request.user

class IsRestaurantOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role == 'restaurant_owner'

class IsOwnerOrAdminForItem(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user or request.user.is_staff