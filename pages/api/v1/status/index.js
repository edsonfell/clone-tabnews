function status(request, response) {
  response.status(200).json({ msg: "Ei, você ai!" });
}

export default status;
