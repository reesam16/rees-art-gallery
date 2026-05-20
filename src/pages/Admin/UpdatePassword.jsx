import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import styles from './Admin.module.css'; // Reusing your clean admin styles

function UpdatePassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setError(null);

        // Security check: Make sure the passwords match before sending to Supabase
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        // Update the user's password in Supabase auth
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            alert("Password updated successfully! Please log in with your new password.");
            // Force a sign out just to clear the recovery session completely
            await supabase.auth.signOut();
            // Send them cleanly back to the admin login page
            navigate('/admin');
        }
    };

    return (
        <div className={styles.loginWrapper}>
            <form onSubmit={handlePasswordUpdate} className={styles.loginForm}>
                <h2>Update Admin Password</h2>
                <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Please enter and confirm your new password below.
                </p>

                {error && <p className={styles.errorMessage}>{error}</p>}

                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit" className={styles.loginButton} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
}

export default UpdatePassword;