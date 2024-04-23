import React from 'react'

const watch = ({ params }: { params: { id: string } }) => {
    const id = params.id;

  return (
    <div>
      <iframe id="ytplayer" width="640" height="360"
  src={`https://www.youtube.com/embed/${id}`}
  frameBorder="0"></iframe>
    </div>
  )
}

export default watch
