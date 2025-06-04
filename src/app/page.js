'use client'

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"

const fetchCarsAPI = async () => {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No token found")

  const res = await fetch("https://invoice.njpurchase.com/api/car-auction-master/auction-cars", {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error("Failed to fetch cars")

  const data = await res.json()
  if (!data.success) throw new Error("API error: " + data.message)

  return data.data.flatMap(auction =>
    auction.car_details.map(car => ({
      ...car,
      auction_date: auction.auction_date,
    }))
  )
}

export default function Home() {
  const router = useRouter()
  const [fadeIn, setFadeIn] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const timerRef = useRef(null)

  const { data: cars, error, isLoading } = useQuery({
    queryKey: ['cars'],
    queryFn: fetchCarsAPI,
    retry: 2,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    if (!cars || cars.length === 0 || showVideo) return

    if (timerRef.current) clearTimeout(timerRef.current)

    const slideShow = () => {
      setFadeIn(false)

      timerRef.current = setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % cars.length)
        setFadeIn(true)
      }, 500)
    }

    const interval = setInterval(slideShow, 5000)

    return () => {
      clearInterval(interval)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [cars, showVideo])

  const handleKeyDown = useCallback(e => {
    if (e.code === "Space") {
      e.preventDefault()
      setShowVideo(prev => !prev)
    }
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const fadeStyles = {
    visible: {
      opacity: 1,
      visibility: 'visible',
      transition: 'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out',
    },
    hidden: {
      opacity: 0,
      visibility: 'hidden',
      transition: 'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out',
      pointerEvents: 'none',
      userSelect: 'none',
    }
  }

  const videoOverlayStyles = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }

  const spinnerStyles = {
    wrapper: "fixed top-0 left-0 w-full h-full bg-black flex justify-center items-center z-50",
    spinner: "border-8 border-white border-t-transparent rounded-full w-24 h-24 animate-spin"
  }

  if (isLoading) {
    return (
      <div className={spinnerStyles.wrapper}>
        <div className={spinnerStyles.spinner}></div>
      </div>
    )
  }

  if (error) return <div className="text-red-500 text-center mt-20">Error: {error.message}</div>
  if (!cars || cars.length === 0) return <div className="text-white text-center mt-20">No cars found</div>

  const car = cars[currentIndex]

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white relative">
      {showVideo && (
        <div style={videoOverlayStyles} onClick={() => setShowVideo(false)}>
          <video
            src="/videos/dubai_auction_promotion.mp4"
            onEnded={() => setShowVideo(false)}
            controls
            autoPlay
            style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px' }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <div style={showVideo ? { display: 'none' } : {}}>
        <div
          className="flex p-3 w-full items-center justify-center"
          style={fadeIn ? fadeStyles.visible : fadeStyles.hidden}
        >
          <h1 className="text-7xl">Stock No. {car.stock_no}</h1>
        </div>

        <div
          className="flex-1 flex w-full"
          style={fadeIn ? fadeStyles.visible : fadeStyles.hidden}
        >
          <div className="w-full flex h-fit">
            <div className="w-[50%] mt-3 ml-10 max-[1030px]:ml-2 flex justify-between">
              <div className="w-full">
                <div className="text-center">
                  <h1 className="text-6xl text-yellow-600">{car.chassis_no}</h1>
                  <h1 className="text-5xl text-red-500">{car.maker} {car.model}</h1>
                </div>

                <div className="flex flex-col mt-5 gap-3">
                  {[
                    { label: "AUCTION DATE", value: car.auction_date },
                    { label: "YEAR", value: car.registration_year },
                    { label: "COLOR", value: car.color_name },
                    { label: "TRANSMISSION", value: car.transmission_name },
                    { label: "DRIVE", value: car.drive_name },
                    { label: "CC", value: car.engine_size },
                    { label: "MILEAGE", value: car.mileage },
                    { label: "STEERING", value: car.steering_name },
                    { label: "DOORS", value: car.doors },
                    { label: "SEATS", value: car.seats },
                  ].map((item, idx) => (
                    <div className="flex w-full" key={idx}>
                      <div className="w-full px-3">
                        <h1 className="text-5xl max-[1600px]:text-3xl">{item.label}</h1>
                      </div>
                      <div className="w-full ml-10">
                        <h1 className="text-5xl text-left max-[1600px]:text-3xl">: {item.value}</h1>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-[50%] flex items-center justify-center flex-col mt-10 gap-5">
              {car.images?.slice(0, 2).map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt="car"
                  width={450}
                  height={600}
                  className="max-[1600px]:w-[400px]"
                  priority={i === 0}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="w-full flex py-4 items-center justify-center gap-2"
          style={fadeIn ? fadeStyles.visible : fadeStyles.hidden}
        >
          <Image src="/logo.png" height={120} width={120} alt="logo" priority />
          <h1 className="text-4xl text-yellow-600">WWW.NAZARJAPAN.COM</h1>
        </div>
      </div>
    </div>
  )
}
