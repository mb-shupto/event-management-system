'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';

export default function AdminRegisterPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();
	const { signupWithEmail } = useAuth();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			await signupWithEmail(email, password);

			const currentUser = auth.currentUser;
			if (!currentUser) {
				throw new Error('Registration succeeded but no user session found. Please log in.');
			}

			await setDoc(
				doc(db, 'users', currentUser.uid),
				{
					name: email.split('@')[0] || 'Admin',
					email,
					role: 'organizer',
					createdAt: serverTimestamp(),
				},
				{ merge: true },
			);

			router.push('/admin/dashboard');
		} catch (error) {
  console.error(error);
  setError((error as Error).message || 'An error occurred');
}finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white p-4">
			<div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
				<h1 className="text-3xl font-bold text-center text-blue-400 mb-2">Register as Admin</h1>
				<p className="text-center text-gray-600 mb-6">Creates an organizer account for the admin portal.</p>

				{error && (
					<div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}

				<form onSubmit={handleRegister} className="space-y-4">
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
						{loading ? 'Creating…' : 'Create Admin Account'}
					</button>
				</form>

				<p className="text-center mt-6 text-gray-600">
					Already have an admin account?{' '}
					<Link href="/admin/login" className="text-blue-400 font-semibold hover:underline">
						Admin Login
					</Link>
				</p>
			</div>
		</div>
	);
}
