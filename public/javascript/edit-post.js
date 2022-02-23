async function editFormHandler(event) {
    event.preventDefault();

    //gets id
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    // get post-title
    const title = document.querySelector('input[name="post-title"]').value;
    
    // send fetch
    const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        title
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
    document.location.replace('/dashboard/');
    } else {
    alert(response.statusText);
    }
}
  
document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);