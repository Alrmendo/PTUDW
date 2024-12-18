const loadProfile = (req, res) => {
    res.render("Profile");
}

const ProfileController = {
    loadProfile: loadProfile,
};

export default ProfileController;