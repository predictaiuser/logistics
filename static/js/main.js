$(document).ready(function() {
    // Handle login form submission
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/token',
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                localStorage.setItem('token', response.access_token);
                window.location.href = '/dashboard';
            },
            error: function(xhr) {
                alert('Login failed: ' + xhr.responseJSON.detail);
            }
        });
    });

    // Handle registration form submission
    $('#registerForm').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/register',
            method: 'POST',
            data: $(this).serialize(),
            success: function() {
                window.location.href = '/login';
            },
            error: function(xhr) {
                alert('Registration failed: ' + xhr.responseJSON.detail);
            }
        });
    });

    // Handle shipping request form submission
    $('#shippingForm').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/shipping-requests',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            data: $(this).serialize(),
            success: function() {
                loadShippingRequests();
                $('#shippingForm')[0].reset();
            },
            error: function(xhr) {
                alert('Error creating shipping request: ' + xhr.responseJSON.detail);
            }
        });
    });

    // Handle edit form submission
    $('#editShippingForm').submit(function(e) {
        e.preventDefault();
        const requestId = $('#edit_request_id').val();
        $.ajax({
            url: `/shipping-requests/${requestId}`,
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            data: $(this).serialize(),
            success: function() {
                $('#editModal').hide();
                loadShippingRequests();
            },
            error: function(xhr) {
                alert('Error updating shipping request: ' + xhr.responseJSON.detail);
            }
        });
    });

    // Modal controls
    $('.close').click(function() {
        $('#editModal').hide();
    });

    $(window).click(function(e) {
        if ($(e.target).is('#editModal')) {
            $('#editModal').hide();
        }
    });

    // Load shipping requests
    function loadShippingRequests() {
        $.ajax({
            url: '/shipping-requests',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: function(requests) {
                const requestsList = $('#requestsList');
                requestsList.empty();
                requests.forEach(function(request) {
                    requestsList.append(`
                        <div class="request-item">
                            <h3>${request.product_name}</h3>
                            <p>Weight: ${request.weight} kg</p>
                            <p>Value: $${request.value}</p>
                            <button onclick="editRequest(${request.id}, '${request.product_name}', ${request.weight}, ${request.value})" class="btn">Edit</button>
                        </div>
                    `);
                });
            }
        });
    }

    // Initialize dashboard if on dashboard page
    if (window.location.pathname === '/dashboard') {
        loadShippingRequests();
    }
});

// Edit request function (defined globally to be accessible from onclick)
function editRequest(id, productName, weight, value) {
    $('#edit_request_id').val(id);
    $('#edit_product_name').val(productName);
    $('#edit_weight').val(weight);
    $('#edit_value').val(value);
    $('#editModal').show();
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
} 