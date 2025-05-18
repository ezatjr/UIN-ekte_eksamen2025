"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Calendar, MapPin, Clock, Tag, Heart } from "lucide-react"
import { fetchEventById } from "../api/ticketmaster"
import type { Event, Classification } from "../types"
import { useAppContext } from "../context/AppContext"
import ArtistCard from "../components/ArtistCard"

// KILDER:
// useparams: https://www.geeksforgeeks.org/reactjs-useparams-hook/
// - useEffect og useState: https://www.w3schools.com/react/react_useeffect.asp
// - Dato formatering: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date


interface FestivalPass {
  id: string
  name: string
  type: string
  date: string
  venue: string
  image: string
  url?: string
  price?: {
    min: number
    max: number
    currency: string
  }
}

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { addToWishlist, removeFromWishlist, isInWishlist } = useAppContext()

  const [isFestival, setIsFestival] = useState(false)
  const [festivalPasses, setFestivalPasses] = useState<FestivalPass[]>([])

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const data = await fetchEventById(id)
        setEvent(data)

        const isFestivalEvent = data?.classifications?.some(
          (c) =>
            c.subType?.name?.toLowerCase() === "festival" ||
            c.segment?.name?.toLowerCase().includes("festival") ||
            c.genre?.name?.toLowerCase().includes("festival") ||
            data.name.toLowerCase().includes("festival"),
        )

        setIsFestival(!!isFestivalEvent)

        if (isFestivalEvent) {
          generateFestivalPasses(data)
        }
      } catch (err) {
        setError("Failed to load event details")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  const generateFestivalPasses = (eventData: Event) => {
    const passes: FestivalPass[] = []
    const venue = eventData._embedded?.venues?.[0]
    const venueName = venue ? `${venue.name}, ${venue.city?.name}` : "Sted ukjent"

    const bestImage =
      eventData.images?.find((img) => img.ratio === "16_9" && img.width > 800)?.url ||
      eventData.images?.[0]?.url ||
      "https://via.placeholder.com/400x225?text=Ingen+Bilde"

    const isMultiDay =
      eventData.dates?.end?.localDate &&
      eventData.dates?.start?.localDate &&
      eventData.dates.end.localDate !== eventData.dates.start.localDate

    const priceRange = eventData.priceRanges?.[0]
    const price = priceRange
      ? {
          min: priceRange.min,
          max: priceRange.max,
          currency: priceRange.currency,
        }
      : undefined

    passes.push({
      id: `${eventData.id}-full`,
      name: `${eventData.name} - Festivalpass`,
      type: "standard",
      date: eventData.dates?.start?.localDate || "",
      venue: venueName,
      image: bestImage,
      url: eventData.url,
      price,
    })

    if (priceRange && priceRange.max > priceRange.min * 1.5) {
      passes.push({
        id: `${eventData.id}-premium`,
        name: `${eventData.name} - Premium Festivalpass`,
        type: "premium",
        date: eventData.dates?.start?.localDate || "",
        venue: venueName,
        image: bestImage,
        url: eventData.url,
        price: {
          min: priceRange.max * 0.8,
          max: priceRange.max,
          currency: priceRange.currency,
        },
      })
    }

    if (isMultiDay) {
      const startDate = new Date(eventData.dates.start.localDate)
      const endDate = new Date(eventData.dates.end.localDate)
      const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

      for (let i = 0; i < dayDiff; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + i)

        const dayName = i === 0 ? "Fredag" : i === 1 ? "Lørdag" : i === 2 ? "Søndag" : `Dag ${i + 1}`

        passes.push({
          id: `${eventData.id}-day-${i + 1}`,
          name: `${eventData.name} - Dagspass ${dayName}`,
          type: "day",
          date: currentDate.toISOString().split("T")[0],
          venue: venueName,
          image: bestImage,
          url: eventData.url,
          price: price
            ? {
                min: price.min * 0.6,
                max: price.min * 0.7,
                currency: price.currency,
              }
            : undefined,
        })
      }
    }

    setFestivalPasses(passes)
  }

  const handleAddToWishlist = (passId: string) => {
    const pass = festivalPasses.find((p) => p.id === passId)
    if (pass && !isInWishlist(event.id)) {
      addToWishlist(event)
    }
  }

  if (isLoading) {
    return <div className="container main-content loading">Laster arrangementdetaljer...</div>
  }

  if (error || !event) {
    return (
      <div className="container main-content error">
        <p>{error || "Arrangement ikke funnet"}</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Tilbake til forsiden
        </Link>
      </div>
    )
  }

  // Sjekk om arrangementet er inne wishlist
  const inWishlist = isInWishlist(event.id)

  const imageUrl =
    event.images && event.images.length > 0
      ? event.images.find((img) => img.ratio === "16_9")?.url || event.images[0].url
      : "https://via.placeholder.com/800x450?text=Bilde+Ikke+Tilgjengelig"

  const formattedDate = event.dates?.start?.localDate
    ? new Date(event.dates.start.localDate).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Dato ikke tilgjengelig"

  const formattedTime = event.dates?.start?.localTime
    ? new Date(`2023-01-01T${event.dates.start.localTime}`).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Tidspunkt ikke tilgjengelig"

  const venue = event._embedded?.venues?.[0]
  const venueLocation = venue
    ? `${venue.name || ""}, ${venue.city?.name || ""}, ${venue.country?.name || ""}`
    : "Sted ikke tilgjengelig"

  // Få sjangere/klassifiseringer
  const getGenres = (classifications?: Classification[]) => {
    if (!classifications || classifications.length === 0) {
      return "Sjanger ikke tilgjengelig"
    }

    return classifications
      .map((classification) => {
        const segments = []

        if (classification.segment?.name && classification.segment.name !== "Undefined") {
          segments.push(classification.segment.name)
        }

        if (classification.genre?.name && classification.genre.name !== "Undefined") {
          segments.push(classification.genre.name)
        }

        if (classification.subGenre?.name && classification.subGenre.name !== "Undefined") {
          segments.push(classification.subGenre.name)
        }

        return segments.join(" - ")
      })
      .join(", ")
  }

  //Få artister/attraksjoner
  const artists = event._embedded?.attractions || []

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(event.id)
    } else {
      addToWishlist(event)
    }
  }

  return (
    <div className="container main-content">
      <div className="event-header">
        <h1 className="event-title">{event.name}</h1>

        <div className="event-meta">
          <div className="event-meta-item">
            <Calendar size={18} />
            <span>{formattedDate}</span>
          </div>

          <div className="event-meta-item">
            <Clock size={18} />
            <span>{formattedTime}</span>
          </div>

          <div className="event-meta-item">
            <MapPin size={18} />
            <span>{venueLocation}</span>
          </div>

          <div className="event-meta-item">
            <Tag size={18} />
            <span>{getGenres(event.classifications)}</span>
          </div>

          <button
            onClick={handleWishlistToggle}
            className={`wishlist-icon ${inWishlist ? "active" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "4px",
              transition: "all 0.3s ease",
            }}
          >
            <Heart size={18} fill={inWishlist ? "#FF4081" : "none"} />
            <span>{inWishlist ? "Lagret" : "Lagre arrangement"}</span>
          </button>
        </div>
      </div>

      <div className="event-detail">
        <div className="event-main">
          <img src={imageUrl || "/placeholder.svg"} alt={event.name} className="event-image" />

          {event.info && (
            <div className="event-info-section">
              <h2 className="event-info-title">Informasjon om arrangementet</h2>
              <p>{event.info}</p>
            </div>
          )}

          {event.pleaseNote && (
            <div className="event-info-section">
              <h2 className="event-info-title">Vennligst merk</h2>
              <p>{event.pleaseNote}</p>
            </div>
          )}

          {isFestival && festivalPasses.length > 0 && (
            <div className="event-info-section">
              <h2 className="event-info-title">Festivalpass</h2>
              <div className="tickets-grid">
                {festivalPasses.map((pass) => (
                  <div key={pass.id} className="card">
                    <div className="card-img-container">
                      <img src={pass.image || "/placeholder.svg"} alt={pass.name} className="card-img" />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">{pass.name}</h3>
                      <div className="card-meta">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-xs)",
                            marginBottom: "var(--spacing-xs)",
                          }}
                        >
                          <MapPin size={16} />
                          <span>{pass.venue}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
                          <Calendar size={16} />
                          <span>
                            {new Date(pass.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      {pass.price && (
                        <div className="ticket-price">
                          {pass.price.min === pass.price.max
                            ? `${pass.price.min} ${pass.price.currency}`
                            : `${pass.price.min} - ${pass.price.max} ${pass.price.currency}`}
                        </div>
                      )}
                      <div className="card-actions">
                        <a target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                          Kjøp billetter
                        </a>
                        <button onClick={() => handleAddToWishlist(pass.id)} className="btn btn-outline">
                          Legg til i ønskeliste
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {artists.length > 0 && (
            <div className="event-info-section">
              <h2 className="event-info-title">Artister</h2>
              <div className="card-grid">
                {artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="event-sidebar">
          <div className="event-info-section">
            <h2 className="event-info-title">Billetter</h2>
            {event.url ? (
              <a
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", textAlign: "center", marginBottom: "1rem" }}
              >
                Kjøp billetter
              </a>
            ) : (
              <p>Billetter ikke tilgjengelig</p>
            )}

            {event.priceRanges && event.priceRanges.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <h3 style={{ marginBottom: "0.5rem" }}>Prisområde</h3>
                {event.priceRanges.map((range, index) => (
                  <div key={index} style={{ marginBottom: "0.5rem" }}>
                    <p>
                      {range.min} - {range.max} {range.currency}
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{range.type}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {venue && (
            <div className="event-info-section">
              <h2 className="event-info-title">Informasjon om stedet</h2>
              <h3>{venue.name}</h3>
              <p>{venue.address?.line1}</p>
              <p>
                {venue.city?.name}, {venue.country?.name}
              </p>

              {venue.url && (
                <a
                  className="btn btn-outline"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginTop: "1rem", display: "inline-block" }}
                >
                  Vis sted
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventPage
