"use client"

const AD_WRAPPER_CLASS = "my-6 flex w-full justify-center overflow-x-clip px-0 sm:px-2 md:my-8"
const AD_SLOT_CLASS =
  "h-[280px] w-full min-w-0 max-w-[336px] overflow-hidden sm:h-[60px] sm:max-w-[468px] md:h-[90px] md:max-w-[728px] xl:max-w-[970px]"

export function GoogleAdUnitPlaceholder() {
  return (
    <div className={AD_WRAPPER_CLASS} aria-hidden="true">
      <div className={AD_SLOT_CLASS} />
    </div>
  )
}
