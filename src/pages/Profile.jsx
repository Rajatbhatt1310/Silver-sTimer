import { useState } from "react";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileStats from "../components/profile/ProfileStats";
import EditProfileModal from "../components/profile/EditProfileModal";

export default function Profile() {
  const [showEditModal, setShowEditModal] =
    useState(false);

  const user = null;
  const stats = null;

  function handleSaveProfile(data) {
    console.log(
      "Update profile through Django:",
      data
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">

      <ProfileHeader />

      {!user ? (
        <div
          className="
            mt-8
            flex min-h-72
            items-center justify-center
            rounded-2xl
            border border-white/[0.07]
            bg-white/[0.02]
          "
        >
          <p className="text-sm text-zinc-500">
            Profile information will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8">
            <ProfileCard
              user={user}
              onEdit={() =>
                setShowEditModal(true)
              }
            />
          </div>

          <div className="mt-6">
            <ProfileStats
              stats={stats}
            />
          </div>
        </>
      )}

      <EditProfileModal
        open={showEditModal}
        user={user}
        onClose={() =>
          setShowEditModal(false)
        }
        onSave={handleSaveProfile}
      />

    </div>
  );
}