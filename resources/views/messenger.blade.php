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
    <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js"></script> -->

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.7.2/font/bootstrap-icons.min.css"/>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro&family=Ubuntu:wght@500&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@3.0.3/dist/index.min.js"></script>
    <link rel="stylesheet" href="./css/app.css">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <style>
        .messenger-container{
            display:flex;
            height:100vh;
        }

        .messenger-sidebar{
            width:100%;
            max-width:400px;
            height:100%;
        }

        .messenger-chat{
            flex: 1;
            height:100%;
        }

        .message-field{
            resize:none;
            min-height:38px !important;
            max-height: 80px !important;
            height:38px;
        }

        .contact-card{
            cursor:pointer;
        }

        .contact-card:hover{
            background-color:#f8f9fa !important;
        }

        .image-upload{
            max-width:130px;
            max-height:200px;
        }
    </style>
</head>
<body>
    <div class="messenger-container">
        <div class="border-end messenger-sidebar">
            <!-- SEARCH SECTION -->
            <div class="messenger-search p-3 border-bottom bg-primary text-light">
                <span class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex">
                        <div class="header-text fs-5 me-1">Messenger</div>
                    </div>
                    <div class="dropdown">
                        <i class="bi bi-gear fs-5 btn text-light" data-bs-toggle="dropdown" aria-expanded="false"></i>
                        <ul class="dropdown-menu p-2">
                            <!-- <li><a class="dropdown-item" href="#">Your profile</a></li> -->
                            <li class="px-3 py-2 d-flex justify-content-between align-items-center">
                                Notifications
                                <div class="form-check form-switch m-0 ms-2 align-items-center d-flex">
                                    <input class="form-check-input m-0" type="checkbox" role="switch" id="notif-settings" checked>
                                </div>
                            </li>
                            <li>
                                <form method="POST" action="{{ route('auth.logout') }}">
                                    @csrf
                                    <input type="submit" class="d-block w-100 btn btn-outline-danger" value="Sign out">
                                </form>
                            </li>
                        </ul>
                    </div>
                </span>
                <div class="position-relative">
                    <input type="search" class="w-100 form-control rounded-pill" placeholder="Search" id="search-contact">

                    <!-- search result -->
                    <div id="search-contact-result" class="d-none text-dark p-2 bg-light rounded shadow top-100 start-0 position-absolute mt-2 w-100" style="z-index:10">
                    
                    </div>
                </div>
            </div>
            <!-- END OF SEARCH SECTION -->

            <!-- CONTACT TYPE SECTION -->
            <div class="px-3 pt-3 d-flex border-bottom contact-type">
                <button class="flex-fill text-start btn px-0 border-bottom" id="person-contacts">
                    <i class="bi bi-person"></i>
                    Person
                </button>
                <button class="flex-fill text-start btn px-0" id="group-contacts">
                    <i class="bi bi-people"></i>
                    Groups
                </button>
            </div>
            <!-- END OF CONTACT TYPE SECTION -->

            <!-- CONTACT LIST SECTION -->
            <div id="contact-list">
                <!-- PLACEHOLDERS -->
                <div class="rounded px-3 py-3 placeholder-glow">
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-secondary placeholder p-4 me-2 position-relative">
                        </div>
                        <span class="flex-fill">
                            <span>
                                <span class="placeholder bg-secondary rounded-pill" style="width: 25%;"></span>
                                <span class="placeholder bg-secondary rounded-pill" style="width: 15%;"></span>
                            </span>
                            <span class="placeholder bg-secondary rounded-pill w-75"></span>
                        </span>
                    </div>
                </div>
                <div class="rounded px-3 py-3 placeholder-glow">
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-secondary placeholder p-4 me-2 position-relative">
                        </div>
                        <span class="flex-fill">
                            <span>
                                <span class="placeholder bg-secondary rounded-pill" style="width: 25%;"></span>
                                <span class="placeholder bg-secondary rounded-pill" style="width: 15%;"></span>
                            </span>
                            <span class="placeholder bg-secondary rounded-pill w-75"></span>
                        </span>
                    </div>
                </div>
                <div class="rounded px-3 py-3 placeholder-glow">
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-secondary placeholder p-4 me-2 position-relative">
                        </div>
                        <span class="flex-fill">
                            <span>
                                <span class="placeholder bg-secondary rounded-pill" style="width: 25%;"></span>
                                <span class="placeholder bg-secondary rounded-pill" style="width: 15%;"></span>
                            </span>
                            <span class="placeholder bg-secondary rounded-pill w-75"></span>
                        </span>
                    </div>
                </div>
                <!-- END OF PLACEHOLDER -->
            </div>
            <!-- END OF CONTACT LIST SECTION -->
        </div>
        <div class="messenger-chat d-flex flex-column overflow-auto" style="max-height:100vh">
            <div class="p-4 border-bottom bg-light position-sticky top-0 d-flex align-items-center justify-content-between" style="z-index:10">
                <h5 class="m-0 fw-bold" id="reciever_name"></h5>
                <input type="hidden" id="auth_id" value="{{ $id }}">
                <button class="btn d-none border" id="add-member-btn" data-bs-toggle="modal" data-bs-target="#add-member-modal">
                    <i class="bi bi-plus"></i>
                </button>
            </div>
            <div class="d-flex flex-column flex-fill">
                <audio class="d-block" id="popup-sound" src="./audio/popup-sound.wav"></audio>
                <div class="message-body flex-fill d-flex flex-column-reverse">
                    <section style="padding-top:2em"></section>
                </div>
                <!-- BOTTOM SECTION FOR SENDING MESSAGE -->
                <div class="position-sticky bottom-0">
                    <!-- LOADER  -->
                    <span class="p-2 d-flex align-items-center send-loader d-none text-warning">
                        <small>
                        <div class="spinner-border text-warning spinner-border-sm" role="status"></div>
                        &nbsp;Sending ...
                        </small>
                    </span>
                    <!-- AUDIO DISPLAY -->
                    <span class="w-100 p-2 d-flex align-items-center audio-record-section d-none bg-secondary bg-opacity-10">
                        <audio controls class="flex-fill" id="audio-record-result" src=""></audio>
                        <i class="btn bi bi-trash fs-5 text-danger" id="remove-recorded-audio"></i>
                    </span>
                    <!-- FILE DISPLAY -->
                    <span class="w-100 p-2 d-flex align-items-center add-file-section d-none bg-secondary bg-opacity-10">
                        <section></section>
                        <i class="btn bi bi-trash fs-5 text-danger" id="remove-added-file"></i>
                    </span>
                    <!-- FORM -->
                    <form method="POST" enctype="multipart/form-data" class="p-3 border-top bg-light form-send-message">
                        @csrf
                        <input type="file" class="d-none hidden-input-file">
                        <input type="hidden" name="to_id" id="to_id">
                        <input type="hidden" name="to_group_id" id="to_group_id">
                        <div class="input-group">
                            <span>
                                <button id="emoji-button" type="button" class="btn me-2 btn-outline-primary">😄</button>
                            </span>
                            <span>
                                <button id="record-button" type="button" class="btn me-2 btn-outline-primary">
                                    <i class="bi bi-mic"></i>
                                </button>
                            </span>
                            <span>
                                <button id="img-button" type="button" class="btn me-2 btn-outline-primary">
                                    <i class="bi bi-paperclip"></i>
                                </button>
                            </span>
                            <textarea class="rounded-pill form-control message-field rounded" placeholder="Write something here..."></textarea>
                            <span>
                                <button type="submit" class="btn ms-2 btn-primary">
                                    <i class="bi bi-send"></i>
                                </button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="position-fixed top-0 end-0 pt-3 pe-3" style="z-index:10">
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <div class="me-auto">
                    <span class="header-text">Messenger</span>
                    <i class="bi bi-chat fw-bolder text-primary"></i>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body bg-light">
                You have new message !
            </div>
        </div>
    </div>

    <div class="loader position-fixed top-0 left-0 w-100 bg-light bg-opacity-50 d-flex justify-content-center align-items-center" style="height:100vh;z-index:1000">
        <h1 class="header-text m-0 me-2">Loading</h1><i class="mb-1 bi bi-chat fs-1 fw-bolder text-primary"></i>
    </div>
    
    <div class="modal fade" id="add-member-modal" tabindex="-1" ria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header add-group-search-form">
                <input type="text" class="form-control" id="add-group-search-bar" placeholder="Search ....">
            </div>
            <div class="modal-body add-group-list-user">
                
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="add-group-btn">Add To Group</button>
            </div>
            </div>
        </div>
    </div>
    <script src="https://js.pusher.com/7.0/pusher.min.js"></script>
    <script src="./js/app.js"></script>
</body>
</html>