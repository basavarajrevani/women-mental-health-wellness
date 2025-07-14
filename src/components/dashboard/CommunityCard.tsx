import { motion } from 'framer-motion';
import { FaUsers, FaHeart, FaComments } from 'react-icons/fa';

const CommunityCard = () => {
  const communities = [
    {
      id: 1,
      title: 'Anxiety Support Group',
      members: 1243,
      activeNow: 23,
      image: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 2,
      title: 'Depression Support',
      members: 892,
      activeNow: 15,
      image: 'https://images.unsplash.com/photo-1573739022854-abfb55aa4485?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 3,
      title: 'Stress Management',
      members: 567,
      activeNow: 8,
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-purple-50 p-6 rounded-xl shadow-md"
    >
      <div className="flex items-center gap-3 mb-4">
        <FaUsers className="text-purple-500 text-2xl" />
        <h3 className="text-xl font-semibold text-purple-700">Community Support</h3>
      </div>

      <div className="grid gap-4">
        {communities.map((community) => (
          <motion.div
            key={community.id}
            className="bg-white p-4 rounded-lg flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={community.image}
              alt={community.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{community.title}</h4>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center text-sm text-gray-500">
                  <FaHeart className="text-pink-500 mr-1" />
                  {community.members} members
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FaComments className="text-green-500 mr-1" />
                  {community.activeNow} active now
                </div>
              </div>
            </div>
            <button className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors">
              Join
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-purple-100 rounded-lg">
        <p className="text-purple-700 text-sm">
          Join our supportive communities to connect with others who understand what you're going through.
          All groups are moderated and maintain strict privacy guidelines.
        </p>
      </div>
    </motion.div>
  );
};

export default CommunityCard;
