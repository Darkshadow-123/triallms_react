const ChapterComment = ({ comment }) => {
  return (
    <article className="media box">
      <div className="media-content">
        <div className="content">
          <p>
            <strong>{comment.name}</strong> {comment.created_at} <br />
            {comment.content}
          </p>
        </div>
      </div>
    </article>
  )
}

export default ChapterComment
