import firebase from '../utils/firebase';
import 'firebase/compat/auth';

const handleAuthAction = async (activeItem, email, password) => {
  try {
    if (activeItem === 'register') {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    } else if (activeItem === 'login') {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    }
    console.log('Success'); // 在成功時輸出
    return true;
  } catch (error) {
    console.log('Error:', error);
    return error.code;
  }
};

export default handleAuthAction;
