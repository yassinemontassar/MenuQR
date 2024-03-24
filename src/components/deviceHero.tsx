"use client"

import { DeviceFrameset } from "react-device-frameset";


export default  function DeviceHero() {
  return (
    <>
      <DeviceFrameset device="Nexus 5" color="black">
        <div className="h-full overflow-y-scroll">
            <iframe  width="100%" height="100%" src={`${process.env.NEXT_PUBLIC_BASE_URL}/website/272f6589-bb5e-4e4b-ba03-6d371e62b88b`}></iframe>

        </div>

        
      </DeviceFrameset>
  </>
  );
}
