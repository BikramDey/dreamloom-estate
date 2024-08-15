import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart, updateUserSuccess, updateUserFailure,
  deleteUserFailure, deleteUserStart, deleteUserSuccess,
  signOutUserStart, signOutUserSuccess, signOutUserFailure
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  const [newAvatarUrl, setNewAvatarUrl] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [tempUrl, setTempUrl] = useState(null);

  // Firebase storage rule:
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  const handleAvatarSelection = (file) => {
    // Store the new file temporarily, without uploading it
    setNewAvatarFile(file);
    
    // Revoke the previous temporary URL if it exists
    if (tempUrl) {
      URL.revokeObjectURL(tempUrl);
    }
    
    // Create a new temporary URL for the preview
    const newTempUrl = URL.createObjectURL(file);
    setTempUrl(newTempUrl);
    setFormData({ ...formData, avatar: newTempUrl }); 
    setNewAvatarUrl(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      let avatarUrl = currentUser.avatar;

      // If a new avatar was selected, upload it to Firebase
      if (newAvatarUrl && newAvatarFile) {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + newAvatarFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = await uploadBytesResumable(storageRef, newAvatarFile);
        avatarUrl = await getDownloadURL(uploadTask.ref);

        // Delete the previous avatar from Firebase if it exists and was uploaded to Firebase
        if (currentUser.avatar && currentUser.avatar.includes("firebasestorage")) {
          const oldAvatarRef = ref(storage, currentUser.avatar);
          await deleteObject(oldAvatarRef);
        }
      }

      // Update the user's profile with the new avatar URL
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, avatar: avatarUrl }),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      // Dispatch success action and update UI
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

      // Cleanup: Remove the temporary file URL if successful
      if (newAvatarUrl === true) {
        URL.revokeObjectURL(tempUrl); // Clean up the temporary URL
        setTempUrl(null); // Reset the temp URL state
        setNewAvatarFile(null); // Reset the file state
        setNewAvatarUrl(false); // Reset the avatar URL state
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };


  const handleDeleteUser = async () => {
    try {
      // Dispatch the delete user start action
      dispatch(deleteUserStart());
  
      // Fetch the user's listings to delete associated images
      const listingsRes = await fetch(`/api/user/listings/${currentUser._id}`);
      const listingsData = await listingsRes.json();
  
      // If there are listings, delete associated images from Firebase
      if (listingsData && listingsData.length > 0) {
        const storage = getStorage(app);
  
        for (const listing of listingsData) {
          // Delete each listing image from Firebase
          for (const imageUrl of listing.imageUrls) {
            if (imageUrl.includes("firebasestorage")) {
              const imageRef = ref(storage, imageUrl);
              await deleteObject(imageRef);
            }
          }
  
          // Delete the listing itself
          await fetch(`/api/listing/delete/${listing._id}`, {
            method: 'DELETE',
          });
        }
      }
  
      // Delete the user's avatar from Firebase if it's from Firebase
      if (currentUser.avatar && currentUser.avatar.includes("firebasestorage")) {
        const storage = getStorage(app);
        const avatarRef = ref(storage, currentUser.avatar);
        await deleteObject(avatarRef);
      }
  
      // Delete the user
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
  
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
  
      // Dispatch the delete user success action
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      // Step 1: Fetch the listing details to get the image URLs
      const res = await fetch(`/api/listing/get/${listingId}`);
      const listing = await res.json();
  
      if (listing.success === false) {
        console.log(listing.message);
        return;
      }
  
      // Step 3: Delete the listing from the database
      const deleteRes = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const deleteData = await deleteRes.json();
  
      if (deleteData.success === false) {
        console.log(deleteData.message);
        return;
      }
  
      // Step 2: Delete each image from Firebase Storage
      const storage = getStorage(app);
      const deletePromises = listing.imageUrls.map((url) => {
        const imageRef = ref(storage, url); // Firebase Storage reference
        return deleteObject(imageRef); // Returns a promise
      });
  
      await Promise.all(deletePromises); // Wait for all delete operations to complete

      // Step 4: Update the state to remove the deleted listing
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
  
    } catch (error) {
      console.log(error.message);
    }
  };
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => handleAvatarSelection(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          // onClick={!newAvatarUrl ? () => fileRef.current.click() : undefined}
          onClick={() => fileRef.current.click()}
          src={tempUrl || formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <input
          type='text'
          placeholder='username'
          defaultValue={currentUser.username}
          id='username'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          id='email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          onChange={handleChange}
          id='password'
          className='border p-3 rounded-lg'
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}