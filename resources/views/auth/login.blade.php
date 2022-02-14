<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" >
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" ></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.7.2/font/bootstrap-icons.min.css"/>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro&family=Ubuntu:wght@500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>
    <div class="mx-auto mt-5 pt-5 px-2" style="max-width:350px;width:100%;">
        <span class="d-flex justify-content-center mb-2">
            <div class="display-6 me-2 header-text">Messenger</div>
            <i class="bi bi-chat fs-2 fw-bolder text-primary"></i>
        </span>

        <form class="border-top pt-3" method="POST" action="{{ route('auth.login') }}">
            @csrf
            <div class="form-floating">
                <input type="email" name="email" id="email" class="form-control @error('email') {{ 'is-invalid' }} @enderror" placeholder="Enter email address" autocomplete="off">
                <label for="email" class="text-dark">Enter email address :</label>
            </div>
            <small class="text-danger">@error('email') {{ $message }} @enderror</small>

            <div class="form-floating mt-3">
                <input type="password" name="password" id="password" class="form-control @error('password') {{ 'is-invalid' }} @enderror" placeholder="Enter password" autocomplete="off">
                <label for="password" class="text-dark">Enter password :</label>
            </div>
            <small class="text-danger">@error('password') {{ $message }} @enderror</small>

            <input type="submit" class="btn btn-primary d-block w-100 mb-2 mt-4 header-text fs-5" value="Sign in">

            <a href="{{ route('auth.signup') }}" class="text-muted"><small>Dont have an account ?</small></a>
        </form>
    </div>
</body>
</html>