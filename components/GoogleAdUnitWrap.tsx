"use client"
import { GoogleAdUnit } from "@mesmotronic/next-adsense"

export default function GoogleAdUnitWrap() {
  return (
    <div className="py-1">
      <GoogleAdUnit>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-2108246014001009"
          data-ad-slot="5811688701"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </GoogleAdUnit>
    </div>
  )
}
