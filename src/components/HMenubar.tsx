"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
	Bars3Icon,
	CalendarIcon,
	HomeIcon,
	UserIcon,
	ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/authContext";

type MenuItem =
	| {
			label: string;
			href: string;
			icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
		}
	| {
			label: string;
			action: "logout";
			icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
		};

export default function HMenubar() {
	const pathname = usePathname();
	const router = useRouter();
	const { logout } = useAuth();

	const [isMinimized, setIsMinimized] = useState(true);

	const items: MenuItem[] = useMemo(
		() => [
			{ label: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
			{ label: "Calendar", href: "/admin/events", icon: CalendarIcon },
			{ label: "Profile", href: "/admin/profile", icon: UserIcon },
			{ label: "Logout", action: "logout", icon: ArrowRightOnRectangleIcon },
		],
		[],
	);

	const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

	const handleLogout = async () => {
		await logout();
		router.push("/admin/login");
	};

	return (
		<aside
			className={`bg-blue-400 text-white flex flex-col h-infinity ${
				isMinimized ? "w-16" : "w-56"
			} transition-all duration-300`}
		>
			<div className="sticky top-0 z-10 flex items-center justify-between p-3 bg-blue-400">
				{isMinimized ? null : (
					<h2 className="text-lg font-bold">Menu</h2>
				)}
				<button
					type="button"
					onClick={() => setIsMinimized((v) => !v)}
					className="inline-flex items-center justify-center rounded-md p-2 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white/70"
					aria-label={isMinimized ? "Expand menu" : "Minimize menu"}
				>
					<Bars3Icon className="h-6 w-6" />
				</button>
			</div>

		<nav className="flex-1 overflow-y-auto py-2">
			<ul className="space-y-1 px-2">
				{items.map((item) => {
					const active = "href" in item ? isActive(item.href) : false;
					const baseClass =
						"w-full inline-flex items-center rounded-md px-3 py-2 transition";
					const activeClass = active ? "bg-blue-500" : "hover:bg-blue-500";

					if ("action" in item) {
						return (
							<li key={item.label}>
								<button
									type="button"
									onClick={handleLogout}
									aria-label={item.label}
									className={`${baseClass} ${activeClass}`}
								>
												{isMinimized ? (
													<item.icon className="h-5 w-5" aria-hidden="true" />
												) : (
													<>
														<item.icon className="h-5 w-5" aria-hidden="true" />
														<span className="ml-3">{item.label}</span>
													</>
												)}
								</button>
							</li>
						);
					}

					return (
						<li key={item.label}>
							<Link
								href={item.href}
								aria-label={item.label}
								className={`${baseClass} ${activeClass}`}
							>
										{isMinimized ? (
											<item.icon className="h-5 w-5" aria-hidden="true" />
										) : (
											<>
												<item.icon className="h-5 w-5" aria-hidden="true" />
												<span className="ml-3">{item.label}</span>
											</>
										)}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	</aside>
	);
}

