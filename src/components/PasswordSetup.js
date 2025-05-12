import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

function PasswordSetup({ user }) {
  const [newPassword, setNewPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(user, newPassword);
      alert('Password set successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Set Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Save Password</button>
      </form>
    </div>
  );
}