
// FUNCTIONS

function updatePasswordBtnHandler(){
    location.replace('/dashboard/update-user-info/password');
};

function updateUsernameBtnHandler(){
    location.replace('/dashboard/update-user-info/username');
};

function updateEmailBtnHandler(){
    location.replace('/dashboard/update-user-info/email');
};

function deleteAccountBtnHandler(){
    location.replace('/dashboard/update-user-info/delete-account')
}


// EVENT LISTENERS
$('#update-password-dashboard-btn').on('click', updatePasswordBtnHandler);
$('#update-username-dashboard-btn').on('click', updateUsernameBtnHandler);
$('#update-email-dashboard-btn').on('click', updateEmailBtnHandler);
$('#delete-account-dashboard-btn').on('click', deleteAccountBtnHandler);