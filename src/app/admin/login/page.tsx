'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';

type AdminRole = 'admin' | 'organizer';

function isAdminRole(role: unknown): role is AdminRole {
	return role === 'admin' || role === 'organizer';
}

export default function AdminLoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();
	const { loginWithEmail, loginWithGoogle, logout } = useAuth();

	const verifyAdminAndRoute = async () => {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			throw new Error('No authenticated user found. Please try again.');
		}

		const snap = await getDoc(doc(db, 'users', currentUser.uid));
		if (!snap.exists()) {
			await logout();
			throw new Error('No profile found for this account. Please register as admin.');
		}

		const data = snap.data();
		if (!isAdminRole(data?.role)) {
			await logout();
			throw new Error('Access denied: this account is not an admin/organizer.');
		}

		router.push('/admin/dashboard');
	};

	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			await loginWithEmail(email, password);
			await verifyAdminAndRoute();
		} catch (error) {
  console.error(error);
  setError((error as Error).message || 'An error occurred');
} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		setLoading(true);
		setError('');

		try {
			await loginWithGoogle();
			await verifyAdminAndRoute();
		}catch (error) {
  console.error(error);
  setError((error as Error).message || 'An error occurred');
}finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white p-4">
			<div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
				<div className="p-10 bg-blue-400 text-white flex flex-col justify-center">
					<h1 className="text-3xl font-bold">Admin Portal</h1>
					<p className="mt-3 text-white/90">
						Sign in with an admin/organizer account to manage events and view dashboard analytics.
					</p>
					<div className="mt-8">
						<Link
							href="/admin/register"
							className="inline-flex items-center justify-center w-full md:w-auto px-5 py-3 rounded-lg bg-white text-teal-700 font-semibold hover:bg-teal-50"
						>
							Register as Admin
						</Link>
					</div>
				</div>

				<div className="p-10">
					<h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
					<p className="mt-2 text-sm text-gray-600">Use your admin email and password.</p>

					{error && (
						<div className="mt-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
							{error}
						</div>
					)}

					<form onSubmit={handleEmailLogin} className="mt-6 space-y-4">
						<div>
							<label className="block text-gray-700 font-medium mb-2">Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
								placeholder="admin@example.com"
							/>
						</div>

						<div>
							<label className="block text-gray-700 font-medium mb-2">Password</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
								placeholder="••••••••"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-blue-400 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50"
						>
							{loading ? 'Signing in…' : 'Sign in'}
						</button>
					</form>

					<div className="mt-6">
						<button
							onClick={handleGoogleLogin}
							disabled={loading}
							className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 flex items-center justify-center gap-3 disabled:opacity-50"
						>
							<svg className="w-5 h-5" viewBox="0 0 24 24">
								<path
									fill="#4285F4"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="#34A853"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="#FBBC05"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="#EA4335"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Continue with Google
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
