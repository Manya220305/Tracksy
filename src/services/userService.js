import api from './api';

const userService = {
    getSettings: async () => {
        const response = await api.get('/user/settings');
        return response.data;
    },

    updateSettings: async (settings) => {
        const response = await api.put('/user/settings', settings);
        return response.data;
    },

    uploadProfileImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post('/user/profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default userService;
