from rest_framework.response import Response


class APIResponseMixin:
    """Mixin to standardize API responses across all viewsets"""

    @staticmethod
    def get_response(data=None, message="Success", success=True, meta=None):
        """Helper method to format API responses"""
        return Response({
            "success": success,
            "message": message,
            "data": data,
            "meta": meta or {}
        })

