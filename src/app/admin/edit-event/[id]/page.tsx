"use client";

  import Image from "next/image";
  import LOGO from "@/app/logo/logo.png";
  import { useEffect, useMemo, useState } from "react";
  import { useParams, useRouter } from "next/navigation";
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { db } from "@/lib/firebase";
  import { useAuth } from "@/lib/authContext";
  import ProtectedRoute from "@/components/ProtectedRoute";

  interface TicketTier {
    name: string;
    price: number;
    total: number;
    sold: number;
  }

  interface EventDoc {
    title?: string;
    type?: string;
    date?: string;
    time?: string;
    location?: string;
    description?: string;
    organizer?: string;
    imageUrl?: string;
    ticketTiers?: TicketTier[];
  }

  export default function EditEventPage() {
    const params = useParams();
    const id = (params?.id as string) || "";
    const router = useRouter();
    const { userProfile, loading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState("");
    const [type, setType] = useState("seminar");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [organizer, setOrganizer] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [tiers, setTiers] = useState<TicketTier[]>([
      { name: "General", price: 0, total: 100, sold: 0 },
    ]);

    const canAccessAdmin = useMemo(() => {
      return userProfile?.role === "admin" || userProfile?.role === "organizer";
    }, [userProfile?.role]);

    useEffect(() => {
      const fetchEvent = async () => {
        if (!id) {
          setError("Missing event id.");
          setLoading(false);
          return;
        }

        try {
          const snap = await getDoc(doc(db, "events", id));
          if (!snap.exists()) {
            setError("Event not found.");
            setLoading(false);
            return;
          }

          const data = snap.data() as EventDoc;
          setTitle(data.title || "");
          setType(data.type || "seminar");
          setDate(data.date || "");
          setTime(data.time || "");
          setLocation(data.location || "");
          setDescription(data.description || "");
          setOrganizer(data.organizer || "");
          setImageUrl(data.imageUrl || "");

          const loadedTiers = Array.isArray(data.ticketTiers) ? data.ticketTiers : [];
          setTiers(
            loadedTiers.length > 0
              ? loadedTiers
              : [{ name: "General", price: 0, total: 100, sold: 0 }],
          );
        } catch (error) {
  console.error(error);
  setError((error as Error).message || 'An error occurred');
} finally {
          setLoading(false);
        }
      };

      fetchEvent();
    }, [id]);

    const addTier = () => {
      setTiers((prev) => [...prev, { name: "New Tier", price: 0, total: 50, sold: 0 }]);
    };

    const updateTier = (index: number, field: keyof TicketTier, value: string | number) => {
      setTiers((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    };

    const removeTier = (index: number) => {
      setTiers((prev) => {
        if (prev.length <= 1) return prev;
        return prev.filter((_, i) => i !== index);
      });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!id) return;

      setSaving(true);
      setError(null);

      try {
        await updateDoc(doc(db, "events", id), {
          title,
          type,
          date,
          time,
          location,
          description,
          organizer,
          imageUrl,
          ticketTiers: tiers,
        });

        router.push("/admin/events");
      } catch (error) {
  console.error(error);
  setError((error as Error).message || 'An error occurred');
} finally {
        setSaving(false);
      }
    };

    if (authLoading || loading) {
      return <div className="text-center py-20 text-white">Loading event...</div>;
    }

    if (!canAccessAdmin) {
      return <div className="text-center py-20 text-white">Access Denied</div>;
    }

    if (error) {
      return (
        <ProtectedRoute>
          <div className="p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
              <p className="mt-2 text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => router.push("/admin/events")}
                className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
              >
                Back to Events
              </button>
            </div>
          </div>
        </ProtectedRoute>
      );
    }

    return (
      <ProtectedRoute>
        <div className="p-4 bg-gradient-to-r from-blue-50 to-white min-h-screen text-black">
          <div className="mt-4">
            <div className="mb-6 flex items-center">
              <Image
                src={LOGO}
                alt="Event Management System Logo"
                width={50}
                height={50}
                className="mr-2"
              />
              <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
                    required
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                  >
                    <option value="seminar">Seminar</option>
                    <option value="music show">Music Show</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="debate">Debate</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
                    placeholder="e.g., 10:00 AM - 12:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
                    required
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                  <input
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
                    placeholder="Enter organizer name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
                  placeholder="Enter event description"
                  rows={4}
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-gray-900">Ticket Tiers</h2>
                  <button
                    type="button"
                    onClick={addTier}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add Tier
                  </button>
                </div>

                <div className="space-y-3">
                  {tiers.map((tier, index) => (
                    <div key={`${tier.name}-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => updateTier(index, "name", e.target.value)}
                        className="p-2 border rounded text-gray-900 placeholder-gray-500"
                        placeholder="Tier name"
                      />
                      <input
                        type="number"
                        value={tier.price}
                        onChange={(e) => updateTier(index, "price", parseFloat(e.target.value) || 0)}
                        className="p-2 border rounded text-gray-900"
                        placeholder="Price"
                        min={0}
                      />
                      <input
                        type="number"
                        value={tier.total}
                        onChange={(e) => updateTier(index, "total", parseInt(e.target.value) || 0)}
                        className="p-2 border rounded text-gray-900"
                        placeholder="Total"
                        min={0}
                      />
                      <button
                        type="button"
                        onClick={() => removeTier(index)}
                        disabled={tiers.length <= 1}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/admin/events")}
                  className="flex-1 bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Update Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </ProtectedRoute>
    );
  }