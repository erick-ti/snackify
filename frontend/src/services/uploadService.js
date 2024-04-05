import axios from "axios";
import { toast } from "react-toastify";

export const uploadImage = async event => {
    let toastId = null;

    const image = await getImage(event);
    if (!image) return null;

    const formData = new FormData();
    formData.append('image', image, image.name);
    const response = await axios.post('api/upload', formData, {
        onUploadProgress: ({progress}) => {
            if (toastId) toast.update(toastId, { progress });
            else toastId = toast.success('Uploading...', { progress });
        },
    });
    // dismiss toast once image is uploaded
    toast.dismiss(toastId);
    return response.data.imageUrl; // send to client side
};

const getImage = async event => {
    const files = event.target.files;

    // no files
    if(!files || files.length <= 0) {
        toast.warning('Upload file is not selected!', 'File Upload');
        return null;
    }
    
    const file = files[0]; // first file

    // wrong file type
    if (file.type !== 'image/jpeg') {
        toast.error('Only JPG type is allowed', 'File Type Error');
        return null;
    }

    return file;
}