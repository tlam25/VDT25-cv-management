PGDMP  )                     }            vtit-cv-mana    16.8    17.0 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    25495    vtit-cv-mana    DATABASE     p   CREATE DATABASE "vtit-cv-mana" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE "vtit-cv-mana";
                     postgres    false            g           1247    25497    cvstatus    TYPE     [   CREATE TYPE public.cvstatus AS ENUM (
    'Updated',
    'In Progress',
    'Cancelled'
);
    DROP TYPE public.cvstatus;
       public               postgres    false            j           1247    25504    employeestatus    TYPE     L   CREATE TYPE public.employeestatus AS ENUM (
    'active',
    'inactive'
);
 !   DROP TYPE public.employeestatus;
       public               postgres    false            m           1247    25510    enrollmentstatus    TYPE     T   CREATE TYPE public.enrollmentstatus AS ENUM (
    'In Progress',
    'Completed'
);
 #   DROP TYPE public.enrollmentstatus;
       public               postgres    false            �           1247    25769    requeststatus    TYPE     ]   CREATE TYPE public.requeststatus AS ENUM (
    'pending',
    'accepted',
    'cancelled'
);
     DROP TYPE public.requeststatus;
       public               postgres    false            p           1247    25516    roletype    TYPE     g   CREATE TYPE public.roletype AS ENUM (
    'Admin',
    'Project Manager',
    'Leader',
    'Staff'
);
    DROP TYPE public.roletype;
       public               postgres    false            s           1247    25526    trainingstatus    TYPE     R   CREATE TYPE public.trainingstatus AS ENUM (
    'In Progress',
    'Completed'
);
 !   DROP TYPE public.trainingstatus;
       public               postgres    false            �            1259    25592    accounts    TABLE     �   CREATE TABLE public.accounts (
    account_id integer NOT NULL,
    emp_id integer NOT NULL,
    username character varying NOT NULL,
    hashed_password character varying NOT NULL
);
    DROP TABLE public.accounts;
       public         heap r       postgres    false            �            1259    25591    accounts_account_id_seq    SEQUENCE     �   CREATE SEQUENCE public.accounts_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.accounts_account_id_seq;
       public               postgres    false    226            �           0    0    accounts_account_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.accounts_account_id_seq OWNED BY public.accounts.account_id;
          public               postgres    false    225            �            1259    25532    courses    TABLE     �   CREATE TABLE public.courses (
    course_id integer NOT NULL,
    course_name character varying,
    description character varying
);
    DROP TABLE public.courses;
       public         heap r       postgres    false            �            1259    25531    courses_course_id_seq    SEQUENCE     �   CREATE SEQUENCE public.courses_course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.courses_course_id_seq;
       public               postgres    false    216            �           0    0    courses_course_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.courses_course_id_seq OWNED BY public.courses.course_id;
          public               postgres    false    215            �            1259    25722 
   cv_details    TABLE     w   CREATE TABLE public.cv_details (
    id integer NOT NULL,
    cv_id integer NOT NULL,
    summary character varying
);
    DROP TABLE public.cv_details;
       public         heap r       postgres    false            �            1259    25721    cv_details_id_seq    SEQUENCE     �   CREATE SEQUENCE public.cv_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.cv_details_id_seq;
       public               postgres    false    240            �           0    0    cv_details_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.cv_details_id_seq OWNED BY public.cv_details.id;
          public               postgres    false    239            �            1259    25609    cv_items    TABLE     �   CREATE TABLE public.cv_items (
    cv_id integer NOT NULL,
    emp_id integer NOT NULL,
    update_date date,
    editor_id integer,
    status public.cvstatus
);
    DROP TABLE public.cv_items;
       public         heap r       postgres    false    871            �            1259    25608    cv_items_cv_id_seq    SEQUENCE     �   CREATE SEQUENCE public.cv_items_cv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.cv_items_cv_id_seq;
       public               postgres    false    228            �           0    0    cv_items_cv_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.cv_items_cv_id_seq OWNED BY public.cv_items.cv_id;
          public               postgres    false    227            �            1259    25542    departments    TABLE     l   CREATE TABLE public.departments (
    dept_id integer NOT NULL,
    dept_name character varying NOT NULL
);
    DROP TABLE public.departments;
       public         heap r       postgres    false            �            1259    25541    departments_dept_id_seq    SEQUENCE     �   CREATE SEQUENCE public.departments_dept_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.departments_dept_id_seq;
       public               postgres    false    218            �           0    0    departments_dept_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.departments_dept_id_seq OWNED BY public.departments.dept_id;
          public               postgres    false    217            �            1259    25572 	   employees    TABLE     �  CREATE TABLE public.employees (
    emp_id integer NOT NULL,
    dept_id integer,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying,
    phone character varying,
    start_date date NOT NULL,
    status public.employeestatus NOT NULL,
    address character varying,
    gender character varying NOT NULL,
    dob date NOT NULL
);
    DROP TABLE public.employees;
       public         heap r       postgres    false    874            �            1259    25571    employees_emp_id_seq    SEQUENCE     �   CREATE SEQUENCE public.employees_emp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.employees_emp_id_seq;
       public               postgres    false    224            �           0    0    employees_emp_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.employees_emp_id_seq OWNED BY public.employees.emp_id;
          public               postgres    false    223            �            1259    25629    enrollments    TABLE     �   CREATE TABLE public.enrollments (
    enrollment_id integer NOT NULL,
    course_id integer,
    emp_id integer,
    complete_date date,
    status public.enrollmentstatus,
    duration character varying(100)
);
    DROP TABLE public.enrollments;
       public         heap r       postgres    false    877            �            1259    25628    enrollments_enrollment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.enrollments_enrollment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.enrollments_enrollment_id_seq;
       public               postgres    false    230            �           0    0    enrollments_enrollment_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.enrollments_enrollment_id_seq OWNED BY public.enrollments.enrollment_id;
          public               postgres    false    229            �            1259    25649    has_role    TABLE     c   CREATE TABLE public.has_role (
    id integer NOT NULL,
    emp_id integer,
    role_id integer
);
    DROP TABLE public.has_role;
       public         heap r       postgres    false            �            1259    25648    has_role_id_seq    SEQUENCE     �   CREATE SEQUENCE public.has_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.has_role_id_seq;
       public               postgres    false    232            �           0    0    has_role_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.has_role_id_seq OWNED BY public.has_role.id;
          public               postgres    false    231            �            1259    25669 	   has_skill    TABLE     e   CREATE TABLE public.has_skill (
    id integer NOT NULL,
    skill_id integer,
    emp_id integer
);
    DROP TABLE public.has_skill;
       public         heap r       postgres    false            �            1259    25668    has_skill_id_seq    SEQUENCE     �   CREATE SEQUENCE public.has_skill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.has_skill_id_seq;
       public               postgres    false    234            �           0    0    has_skill_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.has_skill_id_seq OWNED BY public.has_skill.id;
          public               postgres    false    233            �            1259    25796    notifications    TABLE     �   CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    request_id integer,
    is_read boolean NOT NULL
);
 !   DROP TABLE public.notifications;
       public         heap r       postgres    false            �            1259    25795 !   notifications_notification_id_seq    SEQUENCE     �   CREATE SEQUENCE public.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.notifications_notification_id_seq;
       public               postgres    false    246            �           0    0 !   notifications_notification_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;
          public               postgres    false    245            �            1259    25689    projects    TABLE     �   CREATE TABLE public.projects (
    proj_id integer NOT NULL,
    pm_id integer NOT NULL,
    proj_name character varying NOT NULL
);
    DROP TABLE public.projects;
       public         heap r       postgres    false            �            1259    25688    projects_proj_id_seq    SEQUENCE     �   CREATE SEQUENCE public.projects_proj_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.projects_proj_id_seq;
       public               postgres    false    236            �           0    0    projects_proj_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.projects_proj_id_seq OWNED BY public.projects.proj_id;
          public               postgres    false    235            �            1259    25776    requests    TABLE     �   CREATE TABLE public.requests (
    request_id integer NOT NULL,
    cv_id integer NOT NULL,
    sender_id integer NOT NULL,
    request_date date NOT NULL,
    message character varying(255),
    status public.requeststatus
);
    DROP TABLE public.requests;
       public         heap r       postgres    false    928            �            1259    25775    requests_request_id_seq    SEQUENCE     �   CREATE SEQUENCE public.requests_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.requests_request_id_seq;
       public               postgres    false    244            �           0    0    requests_request_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.requests_request_id_seq OWNED BY public.requests.request_id;
          public               postgres    false    243            �            1259    25553    roles    TABLE     d   CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name public.roletype NOT NULL
);
    DROP TABLE public.roles;
       public         heap r       postgres    false    880            �            1259    25552    roles_role_id_seq    SEQUENCE     �   CREATE SEQUENCE public.roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.roles_role_id_seq;
       public               postgres    false    220            �           0    0    roles_role_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.roles_role_id_seq OWNED BY public.roles.role_id;
          public               postgres    false    219            �            1259    25562    skills    TABLE     �   CREATE TABLE public.skills (
    skill_id integer NOT NULL,
    skill_name character varying,
    description character varying
);
    DROP TABLE public.skills;
       public         heap r       postgres    false            �            1259    25561    skills_skill_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skills_skill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.skills_skill_id_seq;
       public               postgres    false    222            �           0    0    skills_skill_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.skills_skill_id_seq OWNED BY public.skills.skill_id;
          public               postgres    false    221            �            1259    25706 	   trainings    TABLE       CREATE TABLE public.trainings (
    training_id integer NOT NULL,
    training_name character varying,
    start_date date,
    end_date date,
    status public.trainingstatus,
    institution character varying,
    degree character varying,
    emp_id integer
);
    DROP TABLE public.trainings;
       public         heap r       postgres    false    883            �            1259    25705    trainings_training_id_seq    SEQUENCE     �   CREATE SEQUENCE public.trainings_training_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.trainings_training_id_seq;
       public               postgres    false    238            �           0    0    trainings_training_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.trainings_training_id_seq OWNED BY public.trainings.training_id;
          public               postgres    false    237            �            1259    25738    works_on_project    TABLE     k   CREATE TABLE public.works_on_project (
    id integer NOT NULL,
    emp_id integer,
    proj_id integer
);
 $   DROP TABLE public.works_on_project;
       public         heap r       postgres    false            �            1259    25737    works_on_project_id_seq    SEQUENCE     �   CREATE SEQUENCE public.works_on_project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.works_on_project_id_seq;
       public               postgres    false    242                        0    0    works_on_project_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.works_on_project_id_seq OWNED BY public.works_on_project.id;
          public               postgres    false    241            �           2604    25595    accounts account_id    DEFAULT     z   ALTER TABLE ONLY public.accounts ALTER COLUMN account_id SET DEFAULT nextval('public.accounts_account_id_seq'::regclass);
 B   ALTER TABLE public.accounts ALTER COLUMN account_id DROP DEFAULT;
       public               postgres    false    225    226    226            �           2604    25535    courses course_id    DEFAULT     v   ALTER TABLE ONLY public.courses ALTER COLUMN course_id SET DEFAULT nextval('public.courses_course_id_seq'::regclass);
 @   ALTER TABLE public.courses ALTER COLUMN course_id DROP DEFAULT;
       public               postgres    false    216    215    216            �           2604    25725    cv_details id    DEFAULT     n   ALTER TABLE ONLY public.cv_details ALTER COLUMN id SET DEFAULT nextval('public.cv_details_id_seq'::regclass);
 <   ALTER TABLE public.cv_details ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    239    240    240            �           2604    25612    cv_items cv_id    DEFAULT     p   ALTER TABLE ONLY public.cv_items ALTER COLUMN cv_id SET DEFAULT nextval('public.cv_items_cv_id_seq'::regclass);
 =   ALTER TABLE public.cv_items ALTER COLUMN cv_id DROP DEFAULT;
       public               postgres    false    228    227    228            �           2604    25545    departments dept_id    DEFAULT     z   ALTER TABLE ONLY public.departments ALTER COLUMN dept_id SET DEFAULT nextval('public.departments_dept_id_seq'::regclass);
 B   ALTER TABLE public.departments ALTER COLUMN dept_id DROP DEFAULT;
       public               postgres    false    217    218    218            �           2604    25575    employees emp_id    DEFAULT     t   ALTER TABLE ONLY public.employees ALTER COLUMN emp_id SET DEFAULT nextval('public.employees_emp_id_seq'::regclass);
 ?   ALTER TABLE public.employees ALTER COLUMN emp_id DROP DEFAULT;
       public               postgres    false    223    224    224            �           2604    25632    enrollments enrollment_id    DEFAULT     �   ALTER TABLE ONLY public.enrollments ALTER COLUMN enrollment_id SET DEFAULT nextval('public.enrollments_enrollment_id_seq'::regclass);
 H   ALTER TABLE public.enrollments ALTER COLUMN enrollment_id DROP DEFAULT;
       public               postgres    false    230    229    230            �           2604    25652    has_role id    DEFAULT     j   ALTER TABLE ONLY public.has_role ALTER COLUMN id SET DEFAULT nextval('public.has_role_id_seq'::regclass);
 :   ALTER TABLE public.has_role ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    231    232    232            �           2604    25672    has_skill id    DEFAULT     l   ALTER TABLE ONLY public.has_skill ALTER COLUMN id SET DEFAULT nextval('public.has_skill_id_seq'::regclass);
 ;   ALTER TABLE public.has_skill ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    234    233    234            �           2604    25799    notifications notification_id    DEFAULT     �   ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);
 L   ALTER TABLE public.notifications ALTER COLUMN notification_id DROP DEFAULT;
       public               postgres    false    246    245    246            �           2604    25692    projects proj_id    DEFAULT     t   ALTER TABLE ONLY public.projects ALTER COLUMN proj_id SET DEFAULT nextval('public.projects_proj_id_seq'::regclass);
 ?   ALTER TABLE public.projects ALTER COLUMN proj_id DROP DEFAULT;
       public               postgres    false    236    235    236            �           2604    25779    requests request_id    DEFAULT     z   ALTER TABLE ONLY public.requests ALTER COLUMN request_id SET DEFAULT nextval('public.requests_request_id_seq'::regclass);
 B   ALTER TABLE public.requests ALTER COLUMN request_id DROP DEFAULT;
       public               postgres    false    243    244    244            �           2604    25556    roles role_id    DEFAULT     n   ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);
 <   ALTER TABLE public.roles ALTER COLUMN role_id DROP DEFAULT;
       public               postgres    false    219    220    220            �           2604    25565    skills skill_id    DEFAULT     r   ALTER TABLE ONLY public.skills ALTER COLUMN skill_id SET DEFAULT nextval('public.skills_skill_id_seq'::regclass);
 >   ALTER TABLE public.skills ALTER COLUMN skill_id DROP DEFAULT;
       public               postgres    false    221    222    222            �           2604    25709    trainings training_id    DEFAULT     ~   ALTER TABLE ONLY public.trainings ALTER COLUMN training_id SET DEFAULT nextval('public.trainings_training_id_seq'::regclass);
 D   ALTER TABLE public.trainings ALTER COLUMN training_id DROP DEFAULT;
       public               postgres    false    238    237    238            �           2604    25741    works_on_project id    DEFAULT     z   ALTER TABLE ONLY public.works_on_project ALTER COLUMN id SET DEFAULT nextval('public.works_on_project_id_seq'::regclass);
 B   ALTER TABLE public.works_on_project ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    241    242    242            �          0    25592    accounts 
   TABLE DATA           Q   COPY public.accounts (account_id, emp_id, username, hashed_password) FROM stdin;
    public               postgres    false    226   ��       �          0    25532    courses 
   TABLE DATA           F   COPY public.courses (course_id, course_name, description) FROM stdin;
    public               postgres    false    216   ��       �          0    25722 
   cv_details 
   TABLE DATA           8   COPY public.cv_details (id, cv_id, summary) FROM stdin;
    public               postgres    false    240   7�       �          0    25609    cv_items 
   TABLE DATA           Q   COPY public.cv_items (cv_id, emp_id, update_date, editor_id, status) FROM stdin;
    public               postgres    false    228   ��       �          0    25542    departments 
   TABLE DATA           9   COPY public.departments (dept_id, dept_name) FROM stdin;
    public               postgres    false    218   ��       �          0    25572 	   employees 
   TABLE DATA           �   COPY public.employees (emp_id, dept_id, first_name, last_name, email, phone, start_date, status, address, gender, dob) FROM stdin;
    public               postgres    false    224   2�       �          0    25629    enrollments 
   TABLE DATA           h   COPY public.enrollments (enrollment_id, course_id, emp_id, complete_date, status, duration) FROM stdin;
    public               postgres    false    230   ��       �          0    25649    has_role 
   TABLE DATA           7   COPY public.has_role (id, emp_id, role_id) FROM stdin;
    public               postgres    false    232   F�       �          0    25669 	   has_skill 
   TABLE DATA           9   COPY public.has_skill (id, skill_id, emp_id) FROM stdin;
    public               postgres    false    234   �       �          0    25796    notifications 
   TABLE DATA           M   COPY public.notifications (notification_id, request_id, is_read) FROM stdin;
    public               postgres    false    246   '�       �          0    25689    projects 
   TABLE DATA           =   COPY public.projects (proj_id, pm_id, proj_name) FROM stdin;
    public               postgres    false    236   x�       �          0    25776    requests 
   TABLE DATA           _   COPY public.requests (request_id, cv_id, sender_id, request_date, message, status) FROM stdin;
    public               postgres    false    244   ��       �          0    25553    roles 
   TABLE DATA           3   COPY public.roles (role_id, role_name) FROM stdin;
    public               postgres    false    220   |�       �          0    25562    skills 
   TABLE DATA           C   COPY public.skills (skill_id, skill_name, description) FROM stdin;
    public               postgres    false    222   ��       �          0    25706 	   trainings 
   TABLE DATA           z   COPY public.trainings (training_id, training_name, start_date, end_date, status, institution, degree, emp_id) FROM stdin;
    public               postgres    false    238   
�       �          0    25738    works_on_project 
   TABLE DATA           ?   COPY public.works_on_project (id, emp_id, proj_id) FROM stdin;
    public               postgres    false    242   ��                  0    0    accounts_account_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.accounts_account_id_seq', 37, true);
          public               postgres    false    225                       0    0    courses_course_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.courses_course_id_seq', 19, true);
          public               postgres    false    215                       0    0    cv_details_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.cv_details_id_seq', 45, true);
          public               postgres    false    239                       0    0    cv_items_cv_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.cv_items_cv_id_seq', 45, true);
          public               postgres    false    227                       0    0    departments_dept_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.departments_dept_id_seq', 7, true);
          public               postgres    false    217                       0    0    employees_emp_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.employees_emp_id_seq', 37, true);
          public               postgres    false    223                       0    0    enrollments_enrollment_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.enrollments_enrollment_id_seq', 47, true);
          public               postgres    false    229                       0    0    has_role_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.has_role_id_seq', 45, true);
          public               postgres    false    231            	           0    0    has_skill_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.has_skill_id_seq', 185, true);
          public               postgres    false    233            
           0    0 !   notifications_notification_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.notifications_notification_id_seq', 25, true);
          public               postgres    false    245                       0    0    projects_proj_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.projects_proj_id_seq', 1, false);
          public               postgres    false    235                       0    0    requests_request_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.requests_request_id_seq', 28, true);
          public               postgres    false    243                       0    0    roles_role_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.roles_role_id_seq', 4, true);
          public               postgres    false    219                       0    0    skills_skill_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.skills_skill_id_seq', 17, true);
          public               postgres    false    221                       0    0    trainings_training_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.trainings_training_id_seq', 57, true);
          public               postgres    false    237                       0    0    works_on_project_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.works_on_project_id_seq', 91, true);
          public               postgres    false    241            �           2606    25599    accounts accounts_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (account_id);
 @   ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_pkey;
       public                 postgres    false    226            �           2606    25539    courses courses_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (course_id);
 >   ALTER TABLE ONLY public.courses DROP CONSTRAINT courses_pkey;
       public                 postgres    false    216                       2606    25729    cv_details cv_details_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.cv_details
    ADD CONSTRAINT cv_details_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.cv_details DROP CONSTRAINT cv_details_pkey;
       public                 postgres    false    240            �           2606    25614    cv_items cv_items_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.cv_items
    ADD CONSTRAINT cv_items_pkey PRIMARY KEY (cv_id);
 @   ALTER TABLE ONLY public.cv_items DROP CONSTRAINT cv_items_pkey;
       public                 postgres    false    228            �           2606    25549    departments departments_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (dept_id);
 F   ALTER TABLE ONLY public.departments DROP CONSTRAINT departments_pkey;
       public                 postgres    false    218            �           2606    25581    employees employees_phone_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_phone_key UNIQUE (phone);
 G   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_phone_key;
       public                 postgres    false    224            �           2606    25579    employees employees_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (emp_id);
 B   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_pkey;
       public                 postgres    false    224                       2606    25634    enrollments enrollments_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (enrollment_id);
 F   ALTER TABLE ONLY public.enrollments DROP CONSTRAINT enrollments_pkey;
       public                 postgres    false    230                       2606    25654    has_role has_role_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.has_role
    ADD CONSTRAINT has_role_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.has_role DROP CONSTRAINT has_role_pkey;
       public                 postgres    false    232                       2606    25674    has_skill has_skill_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.has_skill
    ADD CONSTRAINT has_skill_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.has_skill DROP CONSTRAINT has_skill_pkey;
       public                 postgres    false    234            )           2606    25801     notifications notifications_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public                 postgres    false    246                       2606    25696    projects projects_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (proj_id);
 @   ALTER TABLE ONLY public.projects DROP CONSTRAINT projects_pkey;
       public                 postgres    false    236            %           2606    25781    requests requests_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (request_id);
 @   ALTER TABLE ONLY public.requests DROP CONSTRAINT requests_pkey;
       public                 postgres    false    244            �           2606    25558    roles roles_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);
 :   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
       public                 postgres    false    220            �           2606    25569    skills skills_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (skill_id);
 <   ALTER TABLE ONLY public.skills DROP CONSTRAINT skills_pkey;
       public                 postgres    false    222                       2606    25713    trainings trainings_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_pkey PRIMARY KEY (training_id);
 B   ALTER TABLE ONLY public.trainings DROP CONSTRAINT trainings_pkey;
       public                 postgres    false    238                        2606    25743 &   works_on_project works_on_project_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.works_on_project
    ADD CONSTRAINT works_on_project_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.works_on_project DROP CONSTRAINT works_on_project_pkey;
       public                 postgres    false    242            �           1259    25607    ix_accounts_account_id    INDEX     Q   CREATE INDEX ix_accounts_account_id ON public.accounts USING btree (account_id);
 *   DROP INDEX public.ix_accounts_account_id;
       public                 postgres    false    226            �           1259    25605    ix_accounts_emp_id    INDEX     I   CREATE INDEX ix_accounts_emp_id ON public.accounts USING btree (emp_id);
 &   DROP INDEX public.ix_accounts_emp_id;
       public                 postgres    false    226            �           1259    25606    ix_accounts_username    INDEX     T   CREATE UNIQUE INDEX ix_accounts_username ON public.accounts USING btree (username);
 (   DROP INDEX public.ix_accounts_username;
       public                 postgres    false    226            �           1259    25540    ix_courses_course_id    INDEX     M   CREATE INDEX ix_courses_course_id ON public.courses USING btree (course_id);
 (   DROP INDEX public.ix_courses_course_id;
       public                 postgres    false    216                       1259    25736    ix_cv_details_cv_id    INDEX     K   CREATE INDEX ix_cv_details_cv_id ON public.cv_details USING btree (cv_id);
 '   DROP INDEX public.ix_cv_details_cv_id;
       public                 postgres    false    240                       1259    25735    ix_cv_details_id    INDEX     E   CREATE INDEX ix_cv_details_id ON public.cv_details USING btree (id);
 $   DROP INDEX public.ix_cv_details_id;
       public                 postgres    false    240            �           1259    25625    ix_cv_items_cv_id    INDEX     G   CREATE INDEX ix_cv_items_cv_id ON public.cv_items USING btree (cv_id);
 %   DROP INDEX public.ix_cv_items_cv_id;
       public                 postgres    false    228            �           1259    25626    ix_cv_items_editor_id    INDEX     O   CREATE INDEX ix_cv_items_editor_id ON public.cv_items USING btree (editor_id);
 )   DROP INDEX public.ix_cv_items_editor_id;
       public                 postgres    false    228            �           1259    25627    ix_cv_items_emp_id    INDEX     I   CREATE INDEX ix_cv_items_emp_id ON public.cv_items USING btree (emp_id);
 &   DROP INDEX public.ix_cv_items_emp_id;
       public                 postgres    false    228            �           1259    25551    ix_departments_dept_id    INDEX     Q   CREATE INDEX ix_departments_dept_id ON public.departments USING btree (dept_id);
 *   DROP INDEX public.ix_departments_dept_id;
       public                 postgres    false    218            �           1259    25550    ix_departments_dept_name    INDEX     U   CREATE INDEX ix_departments_dept_name ON public.departments USING btree (dept_name);
 ,   DROP INDEX public.ix_departments_dept_name;
       public                 postgres    false    218            �           1259    25588    ix_employees_dept_id    INDEX     M   CREATE INDEX ix_employees_dept_id ON public.employees USING btree (dept_id);
 (   DROP INDEX public.ix_employees_dept_id;
       public                 postgres    false    224            �           1259    25587    ix_employees_email    INDEX     P   CREATE UNIQUE INDEX ix_employees_email ON public.employees USING btree (email);
 &   DROP INDEX public.ix_employees_email;
       public                 postgres    false    224            �           1259    25589    ix_employees_emp_id    INDEX     K   CREATE INDEX ix_employees_emp_id ON public.employees USING btree (emp_id);
 '   DROP INDEX public.ix_employees_emp_id;
       public                 postgres    false    224            �           1259    25590    ix_employees_status    INDEX     K   CREATE INDEX ix_employees_status ON public.employees USING btree (status);
 '   DROP INDEX public.ix_employees_status;
       public                 postgres    false    224                       1259    25645    ix_enrollments_course_id    INDEX     U   CREATE INDEX ix_enrollments_course_id ON public.enrollments USING btree (course_id);
 ,   DROP INDEX public.ix_enrollments_course_id;
       public                 postgres    false    230                       1259    25646    ix_enrollments_emp_id    INDEX     O   CREATE INDEX ix_enrollments_emp_id ON public.enrollments USING btree (emp_id);
 )   DROP INDEX public.ix_enrollments_emp_id;
       public                 postgres    false    230                       1259    25647    ix_enrollments_enrollment_id    INDEX     ]   CREATE INDEX ix_enrollments_enrollment_id ON public.enrollments USING btree (enrollment_id);
 0   DROP INDEX public.ix_enrollments_enrollment_id;
       public                 postgres    false    230                       1259    25667    ix_has_role_emp_id    INDEX     I   CREATE INDEX ix_has_role_emp_id ON public.has_role USING btree (emp_id);
 &   DROP INDEX public.ix_has_role_emp_id;
       public                 postgres    false    232                       1259    25666    ix_has_role_id    INDEX     A   CREATE INDEX ix_has_role_id ON public.has_role USING btree (id);
 "   DROP INDEX public.ix_has_role_id;
       public                 postgres    false    232            	           1259    25665    ix_has_role_role_id    INDEX     K   CREATE INDEX ix_has_role_role_id ON public.has_role USING btree (role_id);
 '   DROP INDEX public.ix_has_role_role_id;
       public                 postgres    false    232                       1259    25685    ix_has_skill_emp_id    INDEX     K   CREATE INDEX ix_has_skill_emp_id ON public.has_skill USING btree (emp_id);
 '   DROP INDEX public.ix_has_skill_emp_id;
       public                 postgres    false    234                       1259    25686    ix_has_skill_id    INDEX     C   CREATE INDEX ix_has_skill_id ON public.has_skill USING btree (id);
 #   DROP INDEX public.ix_has_skill_id;
       public                 postgres    false    234                       1259    25687    ix_has_skill_skill_id    INDEX     O   CREATE INDEX ix_has_skill_skill_id ON public.has_skill USING btree (skill_id);
 )   DROP INDEX public.ix_has_skill_skill_id;
       public                 postgres    false    234            &           1259    25814     ix_notifications_notification_id    INDEX     e   CREATE INDEX ix_notifications_notification_id ON public.notifications USING btree (notification_id);
 4   DROP INDEX public.ix_notifications_notification_id;
       public                 postgres    false    246            '           1259    25813    ix_notifications_request_id    INDEX     [   CREATE INDEX ix_notifications_request_id ON public.notifications USING btree (request_id);
 /   DROP INDEX public.ix_notifications_request_id;
       public                 postgres    false    246                       1259    25703    ix_projects_pm_id    INDEX     G   CREATE INDEX ix_projects_pm_id ON public.projects USING btree (pm_id);
 %   DROP INDEX public.ix_projects_pm_id;
       public                 postgres    false    236                       1259    25702    ix_projects_proj_id    INDEX     K   CREATE INDEX ix_projects_proj_id ON public.projects USING btree (proj_id);
 '   DROP INDEX public.ix_projects_proj_id;
       public                 postgres    false    236                       1259    25704    ix_projects_proj_name    INDEX     O   CREATE INDEX ix_projects_proj_name ON public.projects USING btree (proj_name);
 )   DROP INDEX public.ix_projects_proj_name;
       public                 postgres    false    236            !           1259    25793    ix_requests_cv_id    INDEX     G   CREATE INDEX ix_requests_cv_id ON public.requests USING btree (cv_id);
 %   DROP INDEX public.ix_requests_cv_id;
       public                 postgres    false    244            "           1259    25794    ix_requests_request_id    INDEX     Q   CREATE INDEX ix_requests_request_id ON public.requests USING btree (request_id);
 *   DROP INDEX public.ix_requests_request_id;
       public                 postgres    false    244            #           1259    25792    ix_requests_sender_id    INDEX     O   CREATE INDEX ix_requests_sender_id ON public.requests USING btree (sender_id);
 )   DROP INDEX public.ix_requests_sender_id;
       public                 postgres    false    244            �           1259    25560    ix_roles_role_id    INDEX     E   CREATE INDEX ix_roles_role_id ON public.roles USING btree (role_id);
 $   DROP INDEX public.ix_roles_role_id;
       public                 postgres    false    220            �           1259    25559    ix_roles_role_name    INDEX     I   CREATE INDEX ix_roles_role_name ON public.roles USING btree (role_name);
 &   DROP INDEX public.ix_roles_role_name;
       public                 postgres    false    220            �           1259    25570    ix_skills_skill_id    INDEX     I   CREATE INDEX ix_skills_skill_id ON public.skills USING btree (skill_id);
 &   DROP INDEX public.ix_skills_skill_id;
       public                 postgres    false    222                       1259    25720    ix_trainings_emp_id    INDEX     K   CREATE INDEX ix_trainings_emp_id ON public.trainings USING btree (emp_id);
 '   DROP INDEX public.ix_trainings_emp_id;
       public                 postgres    false    238                       1259    25719    ix_trainings_training_id    INDEX     U   CREATE INDEX ix_trainings_training_id ON public.trainings USING btree (training_id);
 ,   DROP INDEX public.ix_trainings_training_id;
       public                 postgres    false    238                       1259    25755    ix_works_on_project_emp_id    INDEX     Y   CREATE INDEX ix_works_on_project_emp_id ON public.works_on_project USING btree (emp_id);
 .   DROP INDEX public.ix_works_on_project_emp_id;
       public                 postgres    false    242                       1259    25754    ix_works_on_project_id    INDEX     Q   CREATE INDEX ix_works_on_project_id ON public.works_on_project USING btree (id);
 *   DROP INDEX public.ix_works_on_project_id;
       public                 postgres    false    242                       1259    25756    ix_works_on_project_proj_id    INDEX     [   CREATE INDEX ix_works_on_project_proj_id ON public.works_on_project USING btree (proj_id);
 /   DROP INDEX public.ix_works_on_project_proj_id;
       public                 postgres    false    242            +           2606    25600    accounts accounts_emp_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_emp_id_fkey FOREIGN KEY (emp_id) REFERENCES public.employees(emp_id);
 G   ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_emp_id_fkey;
       public               postgres    false    3569    226    224            6           2606    25730     cv_details cv_details_cv_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cv_details
    ADD CONSTRAINT cv_details_cv_id_fkey FOREIGN KEY (cv_id) REFERENCES public.cv_items(cv_id);
 J   ALTER TABLE ONLY public.cv_details DROP CONSTRAINT cv_details_cv_id_fkey;
       public               postgres    false    240    3580    228            ,           2606    25620     cv_items cv_items_editor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cv_items
    ADD CONSTRAINT cv_items_editor_id_fkey FOREIGN KEY (editor_id) REFERENCES public.employees(emp_id);
 J   ALTER TABLE ONLY public.cv_items DROP CONSTRAINT cv_items_editor_id_fkey;
       public               postgres    false    228    3569    224            -           2606    25615    cv_items cv_items_emp_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cv_items
    ADD CONSTRAINT cv_items_emp_id_fkey FOREIGN KEY (emp_id) REFERENCES public.employees(emp_id);
 G   ALTER TABLE ONLY public.cv_items DROP CONSTRAINT cv_items_emp_id_fkey;
       public               postgres    false    3569    228    224            *           2606    25582     employees employees_dept_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_dept_id_fkey FOREIGN KEY (dept_id) REFERENCES public.departments(dept_id);
 J   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_dept_id_fkey;
       public               postgres    false    218    3556    224            .           2606    25635 &   enrollments enrollments_course_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(course_id);
 P   ALTER TABLE ONLY public.enrollments DROP CONSTRAINT enrollments_course_id_fkey;
       public               postgres    false    3553    216    230            /           2606    25640 #   enrollments enrollments_emp_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_emp_id_fkey FOREIGN KEY (emp_id) REFERENCES public.employees(emp_id);
 M   ALTER TABLE ONLY public.enrollments DROP CONSTRAINT enrollments_emp_id_fkey;
       public               postgres    false    230    3569    224            0           2606    25655    has_role has_role_emp_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.has_role
    ADD CONSTRAINT has_role_emp_id_fkey FOREIGN KEY (emp_id) REFERENCES public.employees(emp_id);
 G   ALTER TABLE ONLY public.has_role DROP CONSTRAINT has_role_emp_id_fkey;
       public               postgres    false    224    232    3569            1           2606    25660    has_role has_role_role_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.has_role
    ADD CONSTRAINT has_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id);
 H   ALTER TABLE ONLY public.has_role DROP CONSTRAINT has_role_role_id_fkey;
       public               postgres    false    3562    220    232            2           2606    25680    has_skill has_skill_emp_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.has_skill
    ADD CONSTRAINT has_skill_emp_id_fkey FOREIGN KEY (emp_id) REFERENCES public.employees(emp_id);
 I   ALTER TABLE ONLY public.has_skill DROP CONSTRAINT has_skill_emp_id_fkey;
       public               postgres    false    224    234    3569            3           2606    25675 !   has_skill has_skill_skill_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.has_skill
    ADD CONSTRAINT has_skill_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(skill_id);
 K   ALTER TABLE ONLY public.has_skill DROP CONSTRAINT has_skill_skill_id_fkey;
       public               postgres    false    3565    234    222            ;           2606    25807 +   notifications notifications_request_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.requests(request_id);
 U   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_request_id_fkey;
       public               postgres    false    244    3621    246            4           2606    25697    projects projects_pm_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pm_id_fkey FOREIGN KEY (pm_id) REFERENCES public.employees(emp_id);
 F   ALTER TABLE ONLY public.projects DROP CONSTRAINT projects_pm_id_fkey;
       public               postgres    false    3569    224    236            9           2606    25782    requests requests_cv_id_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_cv_id_fkey FOREIGN KEY (cv_id) REFERENCES public.cv_items(cv_id);
 F   ALTER TABLE ONLY public.requests DROP CONSTRAINT requests_cv_id_fkey;
       public               postgres    false    3580    228    244            :           2606    25787     requests requests_sender_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.employees(emp_id);
 J   ALTER TABLE ONLY public.requests DROP CONSTRAINT requests_sender_id_fkey;
       public               postgres    false    224    3569    244            5           2606    25714    trainings trainings_emp_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_emp_id_fkey FOREIGN KEY (emp_id) REFERENCES public.employees(emp_id);
 I   ALTER TABLE ONLY public.trainings DROP CONSTRAINT trainings_emp_id_fkey;
       public               postgres    false    224    3569    238            7           2606    25744 -   works_on_project works_on_project_emp_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.works_on_project
    ADD CONSTRAINT works_on_project_emp_id_fkey FOREIGN KEY (emp_id) REFERENCES public.employees(emp_id);
 W   ALTER TABLE ONLY public.works_on_project DROP CONSTRAINT works_on_project_emp_id_fkey;
       public               postgres    false    3569    224    242            8           2606    25749 .   works_on_project works_on_project_proj_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.works_on_project
    ADD CONSTRAINT works_on_project_proj_id_fkey FOREIGN KEY (proj_id) REFERENCES public.projects(proj_id);
 X   ALTER TABLE ONLY public.works_on_project DROP CONSTRAINT works_on_project_proj_id_fkey;
       public               postgres    false    242    236    3603            �      x���I��H����xkd������A@@d��_�u_ozu1�[��8�*3)���U:.I��?8!)�a9������c�b�cdP��V^R��7A_" �0]��;u%	!���I��O���1}�a�T"$ A�ߌ5�:�ť`�b	��h5�Yf�AK
P �n���w�_oo�6'����~����<J��*�|
� �T��~;����	̰.'�d��u��b�R�b0 �*���iZz�S�k��U�OB5�>)�����WW�y��.�4�e�3�;��ˌ�;�^�OKP��Z�3�dp�&�ߕZ�\��2��H�͝���n��b��.!<�����;٘�z��V�������zl0N�ǉ�:�����p�o\�z�1ε���o��v&jZw��G��}��8�\^mߝ������.*ó;��MJI����	 y����w��΢QN�`�R��T΁]{+Wtޘ.�� ��������yQix�=x��j���Z�D���) ��2ޔ�Q�x��j�F�OYg=�gI*{\����4�d?��4hP��ލ�[��Ņz�Cr�W��X�='� H;¡���R�3덭�rG�����Ks���8QM�q��M��=���L�P������s�n�� d�ǘ��4U�~>8~R����q��z�-��ZhS@�*�7N*S����D��גr�Ϭ��r�V' E�T�t��S�������=���^V��N����_�n��/��t���v�[�Zg�mﶨ� �u�!���B]��+�_�kNDT'���ܵ_i�?-B� ��M�/���R�M�MF�U�ZW䫞�?� S	�� dʓa�j��hkJ8�u-ϡ/)p�<\g2'dx�4��~��Q�����U�#��X�J���<Z��F@
h�l�J�!ǗD/�]GV���j����l�`d��/�!2޺��k���x0!���*Q�<w�������X����*���`�I<>�S���dH>��������v��2D�[>vP��|��$u&-�9GH@�zt�M��m�N�b��9T�P~���>W������c��T�V�sb�#q�#���|�\ǚ��$ d��Һ��`^�g"_��&��v�lb�L�r�����%C��?;lxKYÐ�������uᐽ��\*�w�IxV�dy�|�Ip�y�#Q�E�~V��-�/-nT!i ���Y�hT���.�zUc�XxkN��-8��� ����@N��Cy�Kܣa�M����rF#-�H���Y<um����w��^��^��	�(=��A���O      �   8  x�mT�N�@]��⮺����cɣ��PNE+u31�=�=6����PT�@�U,�nH�@�B�T5V��D����w�&؈a<3��{�=w&H5���;P�D�����C#q��&�L0�G�
4X:��+�diҍa+M~������~r�t�[b��� um��U�b�{&�I���9�������
,n����ܛ
qc;��Ҥ���"F����1N���L��{��G�75#RW�6�>l��N���A+M�eǘ��Z1tm��t�(���a���T-r���$}���"���~A5�t�� h���O�;�6C�a�\��S���eU	�jd.W�}�`��87�R_"�*�׏\�@-��CT�1�-�Aa�Q�0[[.T`G:U"I2�dO�e�븲|0e�'\���bD�2��_z��Wm&N9Y��:��/%�SȽ���r,ו�<�Ե�d�7�V�Y"ozӡL�G{��gq�p��b�� [����&�^�q�k�ns�_��p;N�/<��ȢR��-�t�������C䑽1�c�=]�x��e��3ꉾ���NN5�i�9
Y#�>6O�s18��ǆY�~�q�D_V�f��B�	�B�R�Ą���
C]g�����.�/?�_��9�T�}������;RM���D*�m9-ܖ�T@\I"�tlX��sP2��;��d�*?P+�M�;��F`�2q|&"�}�{�h��@f,9�KI�3��o��޶��T�LIw���Qp�\f�5S�Ż�SF�T_���7���B� �|���;Z���-ֶ
13�h�ҵ���i�7���      �   `  x��WMo�F=/��*�-J�st�u��vl#=�BS��JZ��X�9�`��c�l��
��^"�ȁ���I�,I�+1(0� ~�Ǜ7oV:�Yˎ��g�c��'�^
��:�pׅ��d:v��M|�#:\t�$:����X��C885̮�a�Ź��.�S���'Ӊ��_�:����S�g!H�	��m�y�1���_��D�<>�x<�e�D�x��ЗCA�_E��5X�5�`D�Qʵ�~<1mz��QFAٿ�])� ��'��~0�mWT���cYJ�T����Um�m�Vgv�D�9�� ��ދ���YA.����m89�hYa:`]�l����k,r���b�&�>����/�	w�d�QH/�&��A
�)�r�щ/���ݩQ��6�.�?H�Q�Ār'����e�p�-C��r�G6��O��j�VB�gA�� �5�yIx���O/�r/�Bk���M��B �
���1�G�;���"��pg��Y��`�]J�/�=I��r��"��`j�f��8��.��G�d�F <Rw�#/�Q�1
9=9@���4(>PF��z$9�!���S��Z�͞���`%�Qmg��4�K�:v)�W&���tF�QCD��'�ç� �b5��v���� t�m[՟�2BN�A<E\��Ck:�5��M�ud� ���%��DO0mYW��{ &��`%��\�k�mbUƤ��5l��K禵w����f�
���˚��_k��|��r}opz���z�!��`�K[��� ��Cs`xNƗy�Q[g05����%���-�م���;,��:'+r�Ǫ��`sΧ�єo������X�eA�����c���>?St��v+\�%����p�<ꬖ�R�&�����G~��v�Q;�JN�"�dr� "�+��C�B��&��v*��Lm���\ J�!��%ѽ��bE�PBڒ+i@Q�tq\\ �`�ա*����J^-җG��Z*�jy��6l�w��I^��o���#�L+*�BV���#l8�b�����喫AU��+��9���%�`���OK�ְ��ʤQ��֣cY�Ӄ=�{�`s0�]l��t����2Ӏ]I�t��>��ѵS'$Y�̨j�:�K���0}�2|'�P�@)ieE������|��YV�X�
Qj��<�z�p�~��x�K�eM���W60���*��<=��_��%庝����:��i���2�)�h~w��=���I�nN
��}�u�gkW%�2QʺZ��\���(;�沭7�pqd*�*�Z}�A�噴Xa�<�a�����+D�d�f����gV�$�!:A�d�t`=WAA�����:����-�~�j���ؽ�      �   7  x�u��n�0Dg�+�.DR��S�.ݺ��%H�����D�t���D��L�$I�S��������B��,�*-�!��������]��B�!C<\���+��Π��T�+���6ʁqvg3խ��{�:Z���7gS݊áI1��B�=����ے�]I�n����@�'�km_b�P��|��0�����1���؈����í`K��x����p�h���)����1����T�t�G��zD��"�5ǿT�K-�:���Y⭕4�sSњq��9��6Z�C��89n#�G(������NxTF;�(��<M��#�      �   4   x�3��q��2��q��2�t
50�2QF\� ʘ�D�r��(3�=... �	�      �   �  x���͊�F��UO��P?��]���q0��hl�c�#5�2��U ���t��$0�@���3�~��[�G*��@C��:���;�%{>eWIΦ���q�}��I^�zY|�ʓl�d�ə��X
���P�'BO(����v�&��M��_2��2O�K|D�x�SWL��a�f������U�Ma��=�<���VV��x�k�>K��h����[m�-�1T4�}���(����]�biRn�M�rģ�/.��h�'$ =�V�<u�^��r�6��m��1mtM
�)��t���ї�_lQ͋զ�+U����˺���$=��{��Ίx����(V�e1C�'���L�1Sx�-��ez���,E/n�$w �J�AIt�.����Tܰ�� �ۆ]X�&��ґ���9�/��(5C.��3jD�^��I��(|��pi�Ž�Hlz2�R2i����v,#��4t��3iK��=��T��������={��o+GX5Mi��(/cg�5��R�Кq�9��,��n�,�T��Ɖ��#D�|J�)�	\���x�䋾v3�bv$AbK��(`����.)9�gc����Ϟ��Z���0�hU�R�����֯\�Q4��舭���w�:"SI�#}��q���%�wǸ|h�<�+:�l\s["���ی�I���\�@j>P��L��y�K�>t�M?��Hn�E�:l6V�Oī��C�4;<mP�̖�0���QM��0�h�R�q�GN�n���1}��m��4�,E�p�M`��+��Y$)���3�>q��^�\i���q�o��i�M����<�"�M��������F�m�,{�*;�Q� 0#u��'!�)��!��ӎ�	���U\� �iz��,�M��I���;�I�[u4I0kq"p8Kߜ�L�a ���.�QO�:#9:�����O!����Z %-���i����{hCNЋژ6\�'�tݝ`��TwO�G
͆Y첹��޶�nS�_�m�6�L̵~3����)"��T�����Ε�"p{���v�����i�&pϭ�6 m�s������������E}0�ׯ	��X�&dƛ�i5[ޜ	���S��
vΫX�: �����<=s�6�S����坕C��:�W�&��(Q�kҹSZ'J�M��E7QR���g�kuyv%8��~��s�?�BS      �   V  x�u�=n�0�g����G�=w�R� kti�"�����a�A<"�G~|42�$I����r���Z��:���
��������yY�W/4Q�+qB`-g��c����i��a�"F3�D����V�<�t�5TR+zD�֦H�9	Gs�L9�H�"&�3�c(�!�͑���C�rPڜ��P^�4Y�e�z�\�;�[C�)d�@誙&wql���}e��=�F����n�e��R"��'y5/W[��˹�%2���Dȵސ���yt�ui�#����Geo�cn����&X�F�M�j7e�i��2�.�� m�J�X�O$"*��ݏ�����<��H۝wF>=��^--$      �   �   x�-���0��a����ޥ���#M�>QN�2J|�ԎQkbi��;�n�[�hS��K�p/���ر�8����G�6���?�JE]֎"��V�
oY�9@�s�����X�@�dI�A��7����y�1�G �_�b�k�y���5C9�0�y�j?�޼!�yË9��V���D���.�      �     x�%�Kr� ���aR���2�?G��f�j��G@�h���g[��6��G<�_�n���o�D~�W{�����yj��w
$V�~�B��Ю��w�wͫu���J��yk��I䃰T2���R_��@�[�N9��.�L��{� �T�1`1 [g��� �4M.G:�|kMj'��\�+��:k�����>���v8�]����"�8E������I�N���*p؟ږLZ2yV���滶5����=��	��[�5�7ݓ��y��_�\��W��<plF������)�� u�>z}\�K�d���\^ʕnc���
����w� $ ]��%�v�Yt�\,�[*��!ϻ����
����a<�����@���-;�5�g��VH���7�!
��ȃ�4�4h&p3�1af^��4#iF���yݘ0,�H��03s^3f�H��03s^>@3��I3f&��0#`FЌ�	33��[0l�H��4��ښ43�1i&�5h&�3�1���WU��Ֆ      �   A   x���	�0ѳTL�/?���
�?�NF6�ኂ[4N:>���XT�*��cᬋ�E�E��      �     x�u��N�@�g�)��\�%sbaa!i���8�^��:!ԁ���*XAHH9!��E�&��h%���߾�����}�rV��K:�K��4	��6<2�Ŀ��NF��r#�C�dÃ�r�+�SH�A��*C�+-��nUS�c����{.qG*>3��뿾c��.$)���P�����=0�:�X���8l����ҁ)����tJ�}8���7mh�y��qL��bJ���*&V��r}1�_�h�f�W�(��2ٿ��Å�\���-D��[��      �   �   x�}�1�@E��S�4�b�,m̲a�8Pl썕��7�Rc��P.ٛ�4F
I&����|b��{<�x�X)sۡV�E)�po�nUajT�=$e��B�Z&̏a�k��	��=\�@�A�i8J���tA8�.ms/��n龗a;��Tj���M�[۾��#�PJJ2J��;�+�D
s�~m�<w���A)�ױ�2�>LM��      �   6   x�3�tL����2�(��JM.Q�M�KLO-�2��IML2L8�K�Ҹb���� _��      �   8  x�}T�n�@=�~�|�U�B�U[����ث8�����'�T!-�-��Q�c��Yۅ�\����̛�ގK�c%�4M6�J�/2r`����L�I��5�~F�;P&?�١�_�AT�2���2,�K\M���t�x���O�F&;�e��T1�Q�mG���&? >����om��#�go0	n��`Jz������T
������+Dږ�X�1PV��z��	�~���m���2�W�&S6$��C1$�s�-�^���/b���CZd
R*BBBPBB(�I�$]#�A6�Q'�~ �#a�_
z��5��������[~��@���b#��T]'��Ֆg�/$	K�+J6d8?6���հ:E��D��\g�W�f�{AJf/�S<�Sq��%�u^6/�R:�H�P��t��)�W�?��xY��e%���P�|"�}��7�^��s��)��%�ɧgP�ڳC��Ө�;���<J ^r�0HG�'�
�CR����a�}��j�X�oA�b�`�븬{^O꺤'���?�ʚ��'��n�������b������b�GB���ǰ����h;��T�uW	���`H|lK��XWV��wZ�q�r[�T�$.I�Gol��[`U	�^&֞K3f��e=��"����Ŧ�n�N��f�xʔ�A���q�gIQ��A��Xt��IR�U>����]#w��)���У,��&<��cg-����2Vl0?�\K�o��v�f��N���V��N|!�T^øo��HN6I��c���I�u�����˃�>Z���o���      �   w  x��W�n�F]�|�����RV��pe((�n�Q%B$*R�DȲ(��(
$Ȫ�F1��E�8h������I�HL8C�4m�و�s�{掎�I�	�$z������zbm6�VC���1:H>ϝ�]=K�+���_���\&�K�x	6�d�
P'��I������ZƮ��w����I��/��X��lpu��l��H��z{ҍ_��$�͓]�D=�|���)	���v��.�梻�����(��4���<$�����������B�7w�F%���G�N/si�&���nW���FI�G0�kT�Zg0%Wϓ�߰� ^]r�N�k��-��OΓ��D (�1�[P~{��Ư|rp��?C����3X���x��xT^�����Ջ�T�D)�}	�� ��/`���7��"�J�ڹ`)�TW�9�U���jVTpiV�Q�15`ێn����?�zK��x�R�6��DX\�zy���Y����-z<���dqu�������L�g+˅U�S�*�p���l�&�M$����y��D$�F���i�Z���!�8r�l˅�?"�]3M����������Ŗ�+_�R�B3Z!%VUfr�R�BR�s�af�!�i�2�'�ȕ���%@E 2t�b�U��["�k �0�� g]��RI�cfdո�������*_3��z�03�g����b	�,��1+��YSM1T�f^F���fa�*���(��a�,*d4@�PN�R�@{:C7w�����Q)|�a�*侶��+��s~	�I*95��^�(eu)S��$�9��>Hv��u�͒���Δ=70�>���M�a�O֗!�V#`#z�51�8��s'��rz�3������'���^dPn�t�[2�.@zC�E�5]��<3X��J�{��f9�����j�����b~�K�c۾áZ�HpGЛ ���	��1�>��h�X�CE��	Cgr����x>7����N��'��������ѕ���O�����)i#��?5�*��kH���E찼���R�'}�ӊa=Y� 	�C�ނ�������,Bg�L�%����ngר�B�]��]GU��D�1��0���?�P?y�1��Uru      �   7  x���� �3*&�a�^��r�c<������>8[G�`?�:�m���$G�m�.Y��b�=0'b�BN�"	k2�9��%�w��������ԋ<�����ג9-U���~��I�? gbI��p���%޲���|e#�\�I.��.5�$�˲Q�_�e!F2i���ze"M6�����2�!�<�$K��"�ǝ W6��D��V�%�C�?�ʒ�x�:,�ïŀ�����&�w�q�vɉ����;]��-����Y�{s�bL2`��\i\�E��0P�hJ6�%F���Q{%���y�~ � �c#     