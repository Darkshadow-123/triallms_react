import { Link } from 'react-router-dom'

const ChapterItem = ({ chapter }) => {
  return (
    <div className="card">
      <div className="card-image">
        <figure className="image is-4by3">
          <img src="http://bulma.io/images/placeholders/1280x960.png" alt="Placeholder" />
        </figure>
      </div>

      <div className="card-content">
        <div className="media">
          <div className="media-content">
            <p className="is-size-5">{chapter.chapter_name}</p>
          </div>
        </div>

        <div className="content">
          <p>{chapter.short_description}</p>
          <Link to={`/content-Management/${chapter.slug}`}>More..</Link>
        </div>
      </div>
    </div>
  )
}

export default ChapterItem
