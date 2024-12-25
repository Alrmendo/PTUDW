import UserModel from '../models/UserModel.js';

const loadSearch = async (req, res) => {
  const searchQuery = req.query.q || ""; 
  console.log(searchQuery);

  const profiles = [
    {
      avatar: '/images/avt.png',
      username: "user1",
      bio: "this is a bio",
      status: "Follow",
      followers: 120,
    },
    {
      avatar: '/images/av1.jpg',
      username: "user1",
      bio: "this is a bio",
      status: "Follow",
      followers: 80,
    },
    {
      avatar: '/images/av1.jpg',
      username: "user1",
      bio: "this is a bio",
      status: "Following",
      followers: 45,
    },
  ];

  const filteredProfiles = profiles.filter(profile =>
    profile.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  res.render("Search", { infomations: filteredProfiles, searchQuery });
};


const SearchController = {
    loadSearch: loadSearch,
}

export default SearchController;