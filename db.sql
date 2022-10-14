--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: iliyan
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO iliyan;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: iliyan
--

CREATE TABLE public.posts (
    id bigint DEFAULT nextval(('public.posts_id_seq'::text)::regclass) NOT NULL,
    slug character varying(100) NOT NULL,
    image character varying(100),
    language character varying(5) NOT NULL,
    common_ids integer NOT NULL,
    title character varying(255) NOT NULL,
    author character varying(100) NOT NULL,
    meta_desc text NOT NULL,
    content text NOT NULL,
    scripts text,
    styles text,
    created_at timestamp(0) without time zone DEFAULT now(),
    updated_at timestamp(0) without time zone DEFAULT now()
);


ALTER TABLE public.posts OWNER TO iliyan;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: iliyan
--

CREATE SEQUENCE public.posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.posts_id_seq OWNER TO iliyan;

--
-- Name: users; Type: TABLE; Schema: public; Owner: iliyan
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(20) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    roles integer[] NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone DEFAULT now(),
    updated_at timestamp(0) without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO iliyan;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: iliyan
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO iliyan;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iliyan
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: iliyan
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: iliyan
--

COPY public.posts (id, slug, image, language, common_ids, title, author, meta_desc, content, scripts, styles, created_at, updated_at) FROM stdin;
1	developers	\N	en	1	Developers	Iliyan	some meta	Developers are coooool people.	\N	\N	2022-03-01 04:55:32	\N
3	senior-developers	\N	en	3	Senior developers	iliyan	Senior developers blog post meta	Senior developers got the power	\N	\N	2022-03-06 04:55:32	\N
4	starshi-programisti	\N	bg	3	Старши програмисти	Илиян	Старши приограмисти мета	Старши програмисти имат силата	\N	\N	2022-03-07 04:55:32	\N
6	mladshi	\N	bg	5	Джуниър програмист	Илиян	Джуниър програмист мета	Джуниър програмистите са пичове	\N	\N	2022-03-10 04:55:32	\N
5	junior	\N	en	5	Junior dev	Iliyan	junior dev meta	I am junior dev	\N	\N	2022-03-09 04:55:32	\N
7	cats	\N	en	7	Cats	Iliyan	cats meta	Cats are awesome	\N	\N	2022-03-13 04:55:32	\N
8	kotki	\N	bg	7	Котките	Илиян	котките мета	Котките са яки	\N	\N	2022-03-14 04:55:32	\N
9	dogs	\N	en	9	Dogs	Iliyan	dogs meta	Dogs are cute	\N	\N	2022-03-15 04:55:32	\N
10	kucheta	\N	bg	9	Кучета	Илиян	кучетата мета	Кучетата са сладки	\N	\N	2022-03-16 04:55:32	\N
2	programisti123	\N	bg	1	Програмисти	Илиян	Мета програмисти	Програмистите са готини хора.	\N	\N	2022-03-02 04:55:32	2022-10-04 16:53:31
11	cow	\N	en	11	Cow	Iliyan	Cow meta	Cow content	\N	\N	2022-10-07 10:54:21	2022-10-07 10:54:21
12	kravi	\N	bg	11	крави	Илиян	крави мета	кравите дават мляко	\N	\N	2022-10-07 10:55:20	2022-10-07 10:55:20
13	birds	\N	en	13	Birds	Iliyan	Birds meta	Birds can fly	\N	\N	2022-10-07 10:57:22	2022-10-07 10:57:22
14	ptichki	\N	bg	13	Птички	Илиян	Птичките мета	Птичките летят	\N	\N	2022-10-07 10:57:56	2022-10-07 10:57:56
15	forest	\N	en	15	Forest	Iliyan	Forest meta	Forest has trees	\N	\N	2022-10-07 10:58:47	2022-10-07 10:58:47
16	gora	\N	bg	15	Гора	Илиян	Гората има дървета	Дървата има дървета	\N	\N	2022-10-07 10:59:27	2022-10-07 10:59:27
19	mountain	\N	en	19	Mountain	Iliyan	Mountain meta	Mountain is cold	\N	\N	2022-10-07 11:00:15	2022-10-07 11:00:15
20	planina	\N	bg	19	Планина	Илиян	Планина мета	Планината е студена	\N	\N	2022-10-07 11:00:51	2022-10-07 11:00:51
21	sea	\N	en	21	Sea	Iliyan	Sea meta	The sea is blue	\N	\N	2022-10-07 11:01:29	2022-10-07 11:01:29
22	more	\N	bg	21	Море	Илиян	Море мета	Морето е синьо	\N	\N	2022-10-07 11:01:58	2022-10-07 11:01:58
23	storm	\N	en	23	Storm	Iliyan	Storm meta	Storm is dangerous	\N	\N	2022-10-07 11:02:55	2022-10-07 11:02:55
24	burq	\N	bg	23	Буря	Илиян	Буря мета	Бурята е опасна	\N	\N	2022-10-07 11:03:23	2022-10-07 11:03:23
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: iliyan
--

COPY public.users (id, name, email, password, roles, verified, created_at, updated_at) FROM stdin;
93	remarke	remarke@abv.bg	$2b$10$6le/8LbNtYa0xb4t9F6aNe/78VbHX5h8kRbhh7TCMWsMfbk8Sv2M2	{2000}	f	2022-06-07 10:28:19	2022-06-07 10:28:19
108	randomuser	randomuser@abv.bg	$2b$10$OwI8kwVVBzZ6DZt4e5ICAOA7z/mWCnQUXA2hWw563302k7GYVbJWm	{2000}	f	2022-06-08 14:52:12	2022-06-08 14:52:12
91	Petar	patar@abv.bg	$2b$10$.GMvgKCYyTjUYWSpeSegXeaiEb.m3R6m1rt.NaebYdW26yPuCqXJe	{2000}	f	2022-04-15 09:22:42	2022-06-07 10:28:28
116	hhfghgf	fddfs@abv.bg	$2b$10$6u3J5aq/i1/Me4R9pSKsAuilL58vtD1/9Dvi8ta/rLXoukll.xewe	{2000}	f	2022-08-10 16:07:39	2022-08-10 16:07:39
89	fsdfsfs	sdsaa@abv.bg	fdsfsdfsd	{2000}	f	2022-04-14 15:11:23	2022-06-07 10:28:29
88	ffsdfsd	abv@abv.bg	fdfsdfsd	{2000}	f	2022-04-14 14:52:25	2022-06-07 10:28:30
87	3	dfs@h.gf	fsddfs	{2000}	f	2022-04-14 09:40:16	2022-06-07 10:28:30
86	30-30-30	30-30-30@abv.de	24-24-24	{2000}	f	2022-04-12 16:19:54	2022-06-07 10:28:31
85	29-29-29	29-29-29@abv.de	24-24-24	{2000}	f	2022-04-12 16:19:48	2022-06-07 10:28:31
84	28-28-28	28-28-28@abv.de	24-24-24	{2000}	f	2022-04-12 16:19:40	2022-06-07 10:28:31
83	27-27-27	27-27-27@abv.de	24-24-24	{2000}	f	2022-04-12 16:19:34	2022-06-07 10:28:32
82	26-26-26	26-26-26@abv.de	24-24-24	{2000}	f	2022-04-12 16:19:27	2022-06-07 10:28:32
81	25-25-25	25-25-25@abv.de	24-24-24	{2000}	f	2022-04-12 16:19:21	2022-06-07 10:28:33
80	24-24-24	24-24-24@abv.de	24-24-24	{2000}	f	2022-04-12 16:19:15	2022-06-07 10:28:33
79	23-23-23	23-23-23@abv.de	11-11-11	{2000}	f	2022-04-12 15:31:31	2022-06-07 10:28:33
78	22-22-22	22-22-22@abv.de	11-11-11	{2000}	f	2022-04-12 15:31:25	2022-06-07 10:28:34
77	21-21-21	21-21-21@abv.de	11-11-11	{2000}	f	2022-04-12 15:31:19	2022-06-07 10:28:34
76	20-20-20	20-20-20@abv.de	11-11-11	{2000}	f	2022-04-12 15:31:14	2022-06-07 10:28:35
75	19-19-19	19-19-19@abv.de	11-11-11	{2000}	f	2022-04-12 15:31:08	2022-06-07 10:28:35
74	18-18-18	18-18-18@abv.de	11-11-11	{2000}	f	2022-04-12 15:31:03	2022-06-07 10:28:35
73	17-17-17	17-17-17@abv.de	11-11-11	{2000}	f	2022-04-12 15:30:52	2022-06-07 10:28:36
72	16-16-16	16-16-16@abv.de	11-11-11	{2000}	f	2022-04-12 15:30:46	2022-06-07 10:28:36
71	15-15-15	15-15-15@abv.de	11-11-11	{2000}	f	2022-04-12 15:30:40	2022-06-07 10:28:37
70	14-14-14	14-14-14@abv.de	11-11-11	{2000}	f	2022-04-12 15:30:34	2022-06-07 10:28:37
69	13-13-13	13-13-13@abv.de	11-11-11	{2000}	f	2022-04-12 15:30:28	2022-06-07 10:28:39
26	Gosho	fdsfds@abv.bg	fdsfsfs	{2000}	f	2022-03-29 16:55:32	2022-06-07 10:28:39
27	Gosho	ufidfusydfuds@abv.bg	kf;dfs	{2000}	f	2022-03-29 16:56:46	2022-06-07 10:28:40
51	check@abv.bg	check@abv.bg	lkdfsfsdfs	{2000}	f	2022-03-30 16:01:38	2022-06-07 10:28:41
52	111111	1111@abv.de	1111111111	{2000}	f	2022-03-31 11:14:12	2022-06-07 10:28:41
28	gdfgdf	dfgdf@abv.bg	fdsfsd	{2000}	f	2022-03-30 11:26:31	2022-06-07 10:28:42
53	222222	2222@abv.de	1111111111	{2000}	f	2022-03-31 11:14:18	2022-06-07 10:28:42
54	333333	33333@abv.de	1111111111	{2000}	f	2022-03-31 11:14:23	2022-06-07 10:28:43
55	4444	444444@abv.de	1111111111	{2000}	f	2022-03-31 11:14:27	2022-06-07 10:28:44
56	55555	55555@abv.de	1111111111	{2000}	f	2022-03-31 11:14:30	2022-06-07 10:28:44
57	66666	666666@abv.de	1111111111	{2000}	f	2022-03-31 11:14:34	2022-06-07 10:28:44
58	777777	777777@abv.de	1111111111	{2000}	f	2022-03-31 11:14:38	2022-06-07 10:28:46
59	888888	88888@abv.de	1111111111	{2000}	f	2022-03-31 11:14:41	2022-06-07 10:28:47
60	999999	9999999@abv.de	1111111111	{2000}	f	2022-03-31 11:14:46	2022-06-07 10:28:47
61	101010101010	101010101010@abv.bg	1111111111	{2000}	f	2022-03-31 11:14:56	2022-06-07 10:28:48
63	smokera	smokera5@abv.bg	jfdkhfksd	{2000}	f	2022-03-31 15:49:43	2022-06-07 10:28:49
62	smokera	smokera@abv.bg	jfdkhfksd	{2000}	f	2022-03-31 15:46:49	2022-06-07 10:28:50
64	sdadas	dsadas@abc.bf	fdfsfsdfsd	{2000}	f	2022-04-05 14:50:35	2022-06-07 10:28:50
65	g	kkdjds@abv.bg	hhhhh	{2000}	f	2022-04-05 15:29:42	2022-06-07 10:28:51
66	gh	kkdjdhs@abv.bg	hhhhh	{2000}	f	2022-04-05 15:29:45	2022-06-07 10:28:51
67	11-11-11	11-11-11@abv.de	11-11-11	{2000}	f	2022-04-12 15:30:06	2022-06-07 10:28:52
68	12-12-12	12-12-12@abv.de	11-11-11	{2000}	f	2022-04-12 15:30:14	2022-06-07 10:28:54
92	genadi	genaddi@abv.bg	$2b$10$38xCPvvYeoyg.43fKotkceT8Mdj.m7nYOnd3qColv/HpUAmsBiQq2	{2000,1991}	f	2022-04-15 10:24:25	2022-06-07 10:30:00
106	remarke3	remarke3@abv.bg	$2b$10$deCS6pAnXraXt2vcgSGtsOm3VReNCW1O8yY298aprwc7frlzp5uOa	{2000,5000}	f	2022-06-07 11:45:55	2022-06-07 11:45:55
107	genadi91	genadi91@abv.bg	$2b$10$gf2NkRsBfGdQLH4l65.V4O82DZpluuwFPd04J7lrQ0xF47Mzh.fRy	{2000,5000}	f	2022-06-08 09:51:43	2022-06-08 09:51:43
90	Genadi	genadi@abv.bg	$2b$10$bB.SgwSW21rJTW/umjUbo.LAc5pgTiO4I5Z4CDmLbMdH3tpZOPDNq	{2000,3000}	f	2022-04-15 09:06:57	2022-06-15 11:20:06
109	genadi	pochivka@abv.bg	$2b$10$VPUIwCzrIUMkQ7UAsPMUuO4snnrBBRWp0WkYTJypUPKMCortel92S	{2000}	f	2022-07-13 16:08:03	2022-07-13 16:08:03
110	smoko	smkokerh@abv.bg	$2b$10$lOsR/896Iatz0fHytwrW0OtRlJWnBF0viPhTUTapBLDuV4hmrQE7y	{2000}	f	2022-07-27 16:23:34	2022-07-27 16:23:34
111	smamsam@	skdjkalsj@abv.bg	$2b$10$r8sF6JeaQ/e/MpHMiqGKB.GCiVXPyIeeULffvfxhiPh9yJKZtHKS2	{2000}	f	2022-07-28 14:05:27	2022-07-28 14:05:27
112	jhhgjgh	ghjhg@abc.bg	$2b$10$D3z5Hws7DG8Z.CKVFyAeI.lNY2FdYEn2Iu4Y/Pgp5h2MazTAswCGC	{2000}	f	2022-07-28 14:39:47	2022-07-28 14:39:47
113	jhhgjgh	ghjgfgdfgd45hg@abc.bg	$2b$10$bWGsz04O1KwuSvy2qhbd2u2LHLzlpHz.xeKaQNdweljYkyMPR4a.6	{2000}	f	2022-07-28 14:40:14	2022-07-28 14:40:14
114	gangstera	gangestra@abv.bg	$2b$10$PeKkYO7VYHaeTeX4lKNtLOLLKZVFi4NKgmRheT.pYe0k4S5xZcKaK	{2000}	f	2022-07-29 11:40:18	2022-07-29 11:40:18
117	gecanko	gecanko@abv.bg	$2b$10$XYN3nEvpKwHUGt/rPDqyrOKnn0L.g4qow9X73uc90PdU0okMCaSqe	{2000}	f	2022-08-12 15:35:21	2022-08-12 15:35:21
118	gecanko	gecanko6@abv.bg	$2b$10$qyzI5zpplwK0qGjmBVCBge8U1svYbyEhGTqhSk1AzFQ6OU5506K6m	{2000}	f	2022-08-12 15:38:34	2022-08-12 15:38:34
120	smokeh	smokeh@abv.bg	$2b$10$Lo70Bm3Z.A7z.14TpV1REetKY4zfWHOaBkWuqIWTGnPeQ0ROodXZS	{2000}	f	2022-08-12 16:36:37	2022-08-12 16:36:37
119	shunkata	shunkata@abv.bg	$2b$10$iZ1tmvU8woDQkIO2KElyHe8vZjmJRdMcW7rl9RdaC/AkgCbc9oWeu	{2000}	t	2022-08-12 15:38:47	2022-09-13 11:07:14
123	django	dddjjj@abv.bg	$2b$10$1piR7nQBDBCw3NMwUFF.Ce./x38/j8t2Kkl5sDGF1kFi6bsD0mjES	{2000}	f	2022-09-01 13:54:46	2022-09-01 13:54:46
124	smadktht	smackthat@gmail.com	$2b$10$I.1d7uwBGK2.mhSeYCAI.uBWzUMAsfKeTK5BrKrkz.QxH.nK3iJA2	{2000}	f	2022-09-01 15:22:26	2022-09-01 15:22:26
125	djangoooo	jdsaldsakl@abv.bg	$2b$10$G1Oe1xhRoZU0MmPCsrjVYuruoWuNhh9FIk7fk1rt7DfT6PRvWqMf.	{2000}	f	2022-09-01 15:37:27	2022-09-01 15:37:27
126	fdfsd@abv.bg	sdasjdka@abv.bg	$2b$10$fnN8yNp.HDG9XjxIZc4S0Oyk4c1s4xE.W0K2oX4qMn20YuexOQo/G	{2000}	f	2022-09-01 15:39:02	2022-09-01 15:39:02
127	djskjdasjdsajk	dskjdsdsadsjlk@abv.bg	$2b$10$ulJU7y9yW/5ar.Hn.ehdFuJmjDw0/l832Exmh/YYAEh..stFDl8am	{2000}	f	2022-09-01 15:42:54	2022-09-01 15:42:54
128	jgghjgh	ghjghg@abv.bg	$2b$10$m0vQoKTxUagiEOK/R1Cfl.SY0fCUvaro9nZe54FELfj3JXeprmm1.	{2000}	f	2022-09-01 15:43:57	2022-09-01 15:43:57
129	fggdfgdf	dfgddfg6@abv.bg	$2b$10$HcJ02HAYI2A4jxBQ/SKqWuS/K7OD.1lpTVdFgU0TBoQ2Ph3eUrnre	{2000}	f	2022-09-01 15:49:54	2022-09-01 15:49:54
130	хйхгйгхй	fggf565665@abv.bg	$2b$10$87jXQrxUTou6rFKA9eUU/OrrTMnbx4wR8zxlziCTY1CM4lVpvIxja	{2000}	f	2022-09-01 15:54:38	2022-09-01 15:54:38
131	gdfgdfgdf	dlkjlkfjsldkjf@abv.bg	$2b$10$HyXeRvdQrRWRfQldpwFcG.6YepJ2amjpKK2qBx/KfJPIsQFQU3ZVa	{2000}	f	2022-09-01 15:56:33	2022-09-01 15:56:33
132	gfhhfg	hfghfghgf777@abv.bg	$2b$10$XpvUcJ5gUwHpbptiimtdWetPvJOFHS.rwGK.U6RWH958059o2yvKW	{2000}	f	2022-09-01 16:08:33	2022-09-01 16:08:33
133	gfhhfg	hfghfghgf777767876@abv.bg	$2b$10$ePTStLX2c36EEJ2jhhLYz.RB3FJ/WEtegzl3l/jsBdKFRPXJ5/3N.	{2000}	f	2022-09-01 16:15:16	2022-09-01 16:15:16
134	gfhhfg	hfghfghgf77776uiiyuiuy7876@abv.bg	$2b$10$x3a0X3nzecCORf7/Lgv6OOiFX.8QEwoxlvNwp.764dfpZJNu1YodW	{2000}	f	2022-09-01 16:16:23	2022-09-01 16:16:23
135	gfhhfg	hfghfghgf9uiiyuiuy7876@abv.bg	$2b$10$JmJp0KkPiQy4yel3y2MxBuqNGNBqjmML1GtG598K28KTyVytSjHk.	{2000}	f	2022-09-01 16:18:16	2022-09-01 16:18:16
136	gfhhfg	hfghfghgf779uiiyuiuy7876@abv.bg	$2b$10$LxW6KCPdb4MgVWkMzmF6FerkReP2r/2X/YQK1487Tfo8ToKOan7My	{2000}	f	2022-09-01 16:21:14	2022-09-01 16:21:14
137	gfhhfg	hfghfghgf779uiiyuiuouiouy7876@abv.bg	$2b$10$Ra8raxHuWWIrYlHtQnSEH.DhBKSi0JOBwtrvabynF6NxQQTBA.XyW	{2000}	f	2022-09-01 16:22:09	2022-09-01 16:22:09
138	dsfsd	sdfsd@ggg.bg	$2b$10$2Dr5FSreGTxUE/RMY/r4hO9lu.aW21iN17kx6OU2qPNUqARul8Ms.	{2000}	f	2022-09-01 16:23:22	2022-09-01 16:23:22
139	dsfsd	sd7777fsd@ggg.bg	$2b$10$IdtAa94DAYzO3kGsfDQhy.vyr.o2zmmNbt6w5QYtK1wVfzwDSR.hy	{2000}	f	2022-09-01 16:24:24	2022-09-01 16:24:24
140	fghfghgf	hfghfghfg@abv.bgj	$2b$10$fR3TmBSZzWvoFZy9fkX13eYRsZVsuLPb//vKZ66pQkPqOirhRFOZO	{2000}	f	2022-09-01 16:59:09	2022-09-01 16:59:09
141	djokovich	djokovich@abv.bg	$2b$10$GZcVJGe6z2yA3BpMAcOBQe8vrgkSeNzBoF2XM.GSp9pPm8kTjwPH6	{2000}	f	2022-09-07 13:38:35	2022-09-07 13:38:35
142	Гошо	goshooo@abv.bg	$2b$10$F.URWxrMX8Kltepo.ifzRObXaEyJzHb6k5IXJoyIx8cBUGUHklDb.	{2000}	f	2022-09-07 13:42:52	2022-09-07 13:42:52
143	ggfhfghfg	hfghfghfg@abv.bg	$2b$10$61aJLVECbwVjuLT66DErEufgRCbYME9O3BxepehXjflIkenOPFG9.	{2000}	f	2022-09-07 14:14:03	2022-09-07 14:14:03
144	fsdfsd	fsdfdsfsd@abv.bg	$2b$10$0aMAPRbL58O1weUqVErAwO7OShNv.UzZxjVyS75nD518vzAvYIU1u	{2000}	f	2022-09-07 14:29:53	2022-09-07 14:29:53
145	Smehurko	smehurko2@abv.bg	$2b$10$THtejO8Xoyib5z.Fs19OguXUWc0gFerwuohbrR9UaOMIy/3EJug7O	{2000}	f	2022-09-07 14:30:40	2022-09-07 14:30:40
146	Chereshko	chereshko@abb.bg	$2b$10$ZjQgerkEWDRWmaN1N.LJTeMUpXaBDbprIcey6jVc8hKZ3.uPL4Fya	{2000}	f	2022-09-07 14:32:30	2022-09-07 14:32:30
147	Рошко	roshko2@abv.bg	$2b$10$C/ODAp7QV6GuCwXdNZQNEOZ85y87NyByrrS2iKRAoy/XoXWaB9jgG	{2000}	f	2022-09-07 14:34:16	2022-09-07 14:34:16
148	Джаро	djaromaro@abv.bg	$2b$10$U7Jqc65RBwf4xfWrEbWITOvWcxfVSssk6Grm7HhBQgasmws1cHgb2	{2000}	f	2022-09-07 14:39:15	2022-09-07 14:39:15
149	Динко	dinko2@abv.bg	$2b$10$.zckVfi4ffimBT9E582rXOEwDUM2zVWnNW7M3BLJ2uaboGKw56TzG	{2000}	f	2022-09-07 14:54:52	2022-09-07 14:54:52
150	Динко	dinko72@abv.bg	$2b$10$s/2m4k38grtytrP/D28Kru5hPf2WxP4kyZGmkxeTwLpQHZKhpultm	{2000}	f	2022-09-07 14:56:31	2022-09-07 14:56:31
151	Динко	dinko762@abv.bg	$2b$10$7qGiMtPWsKQ.cdt7ShWRvujTjtIQSgdp4ht8GqfViBbKee5kMkWoS	{2000}	f	2022-09-07 15:00:16	2022-09-07 15:00:16
152	Таралежко	taralejko@abv.bg	$2b$10$txmJdhHqE3AoN3FdDoiMMukZLWMXhl0cKdH.q.GPNn3AVYZ12Xc1y	{2000}	f	2022-09-07 15:03:59	2022-09-07 15:03:59
153	Ежко	ejko2@abv.bg	$2b$10$pH1NriO2eRojYehcW7ZPGONH.v/l1PplhpmcHXmI7G7RbHgpohJ9C	{2000}	f	2022-09-07 15:05:59	2022-09-07 15:05:59
154	Смехурко2	smehurko23@abv.bg	$2b$10$RcYZarLDTBHPSpVHBa5FkeKa57jLNbsHrIr6fOeKvzWqGHMGNe0YG	{2000}	f	2022-09-07 15:24:49	2022-09-07 15:24:49
155	smehurko	smehurko368@abv.bg	$2b$10$zusANEP.Otmc0THJWh4E7O6epGhgprnH/EY3UYhq6TLBXWppyvy3q	{2000}	f	2022-09-07 15:27:43	2022-09-07 15:27:43
156	Bingo	bingo368@abv.bg	$2b$10$2O9DkLLpBn7YFIeJht37BOee4hlB6tuRQMxCFwfIa6qd.t.LE3OCi	{2000}	f	2022-09-07 16:30:24	2022-09-07 16:30:24
157	Bingo	bingo3689@abv.bg	$2b$10$zHLa8EvOt1iiHMDtahvg6Ogs31n/.KYEgiKFZUcXoi/J48kPvDNnG	{2000}	f	2022-09-07 16:32:12	2022-09-07 16:32:12
158	bingo2	bingo222@abv.bg	$2b$10$iexIC1MwQ9B8suE/OHNYMO01tnXDJEXVUscEihn/VGpbvT3vxwnBu	{2000}	f	2022-09-07 16:33:30	2022-09-07 16:33:30
159	kokokokoko	kokokokoko@abv.bg	$2b$10$RXwrsedr/3OtWzdsd1UgPuskUQjFCmQozmKbwIaeBxJaLRtglM49W	{2000}	f	2022-09-08 11:17:43	2022-09-08 11:17:43
160	kokokokok	kokokokok22@abv.bg	$2b$10$dGntKjF7MDBk5.v6Rmvg4uREH.UlsygEMMjPl.o.q4Lsu79zs4MTm	{2000}	f	2022-09-08 11:18:31	2022-09-08 11:18:31
161	dododokdoddo	dododkdodo@abv.bg	$2b$10$7TzWovo4dQYRcEulVGkrxu68A9xWjL6Q0/Jk9.YJ6hzW12LGPxj3m	{2000}	f	2022-09-08 11:24:56	2022-09-08 11:24:56
162	rudirudi	rudirudi@abv.bg	$2b$10$e.nZVquT35RSRvYehCeEIekOERTzzbq/yyFljUbFAlMXT87YotlZy	{2000}	f	2022-09-08 11:26:31	2022-09-08 11:26:31
163	smoki	smoki555@abv.bgl	$2b$10$nvWgu0cMdSOeIyZjPWIaheZiq50gFt19Gpm/LnQx7ZOa2BHoo0OX.	{2000}	f	2022-09-08 11:31:54	2022-09-08 11:31:54
164	lokoloko	lokoloko@abv.bg	$2b$10$4EeT1URbHUsuRcFimS5iXurgDz6VEkch7Qa72M0TcNE7jfdwHG6p2	{2000}	f	2022-09-08 11:34:13	2022-09-08 11:34:13
165	hghfgh	fghfgh7@abv.bg	$2b$10$5wyx3smf0fXvmB91.wFvj.eGgwZihSl2kLVklcyqFsCbTpKDXsLNa	{2000}	f	2022-09-08 11:38:56	2022-09-08 11:38:56
166	fgdfgdfg	dgdfgf6@abv.nh	$2b$10$1.CxkLq5bQ70qg/GyzBRg.A9EC2PZfwoD1Jz27hyrj7D.y4koF5KG	{2000}	f	2022-09-08 11:40:30	2022-09-08 11:40:30
167	ghgfhfghf	hfghfg@abv.bg	$2b$10$5LIwOyi36ddpdxY7GeRpeeaNEY2ptMQiNJLnqMDXdr9TOS58XORQG	{2000}	f	2022-09-08 11:41:13	2022-09-08 11:41:13
168	fghfghfghfg	fghg66@abv.bg	$2b$10$bEvTulf5swJNfjlbwnYNPOUqT2dBDbu8AxKTPwoJRe2telk7qnZ2G	{2000}	f	2022-09-08 11:43:20	2022-09-08 11:43:20
169	hfghfghfg	hfg5676@abv.bg	$2b$10$9UW8n/pHYRNvzYLCjs2JuuRCVNLBAm8nRiXVi8ZPru7Fa8d/oRIiO	{2000}	f	2022-09-08 11:45:23	2022-09-08 11:45:23
170	kskdkdoooo	kdsokdoakdoaskooo@abv.bg	$2b$10$Hq6GgmbCfgiRMDhbfhV3QutgOvG5zVwTQ5S34hleyAsdq7AEMtUJS	{2000}	f	2022-09-09 10:00:32	2022-09-09 10:00:32
171	kalinkata1	kalinkata1@abv.bg	$2b$10$pnGE2Nou9xLgS0tgVDrDm.DW0Fwh9ovPA98jvka6iFotUQ/axp/WG	{2000}	f	2022-09-09 13:16:26	2022-09-09 13:16:26
172	kalinkata2	kalinkata2@abv.bg	$2b$10$KxWfhjDHZ0y5iiBMrKVLJepiHUJjpXZETpXv14/HmORM04BHs/DJm	{2000}	f	2022-09-09 13:18:21	2022-09-09 13:18:21
174	dokovec	dokovec@abv.bg	$2b$10$vjYBqw2HN2Lmxlz0EHMJpeAbKDWXgfCyCGpUQOXC7eHkQXD.TRbp2	{2000}	f	2022-09-09 14:21:28	2022-09-09 14:21:28
173	kalinkata3	kalinkata3@abv.bg	$2b$10$7YjPLRbwqx3zZkk2biNNyegLhLi1gTrw82YxtwmfmiwUb2B4BHGh2	{2000}	f	2022-09-09 13:22:34	2022-09-09 14:45:51
176	kalinkata4	kalinkata4@abv.bg	$2b$10$3xZvvEmJqD1NfeTJI3RHVuKsSI9o3wu8QpJBN..KKv1yk.SvFgGs2	{2000}	f	2022-09-09 14:46:28	2022-09-09 14:46:38
177	kalinkata5	kalinkata5@abv.bg	$2b$10$ZuA7PlOAYOr7R6kCwAaiQeGaquHs1Q8b2erPEBMFB.lP6jGGL/wLe	{2000}	t	2022-09-09 14:47:30	2022-09-09 14:47:45
178	kalinkaa7	kalinkata7z@abv.bg	$2b$10$XGh0L5ncdejW9XzD0KDLcOxUKdaIkxshFkFs/Phj941kWOpKyeXMi	{2000}	t	2022-09-09 14:50:12	2022-09-09 14:50:53
179	kalinkata9	kalinkata9@abv.bg	$2b$10$ACb79ezGuo3ZOKFMAHJzk.6TVZcdToWjkNe5uuDFrinXRoR7sD.mG	{2000}	t	2022-09-09 14:57:39	2022-09-09 14:57:49
180	gandalf1	gandalf1@abv.bg	$2b$10$0JPEtBtjCwAEPQRTjuALK.xmmAgfpDiE2II58P2XEOYrskmw1OGaW	{2000}	t	2022-09-15 11:19:59	2022-09-15 11:49:33
181	Iliyan	lishkov@oddstorm.company	$2b$10$WWP5xuk7Yvwlfc6iRkbyFuZynFXV4xoZUiuuuMk8lQCKODyyyAMaG	{2000}	t	2022-09-20 10:20:20	2022-09-20 10:20:42
115	django	django@abv.bg	$2b$10$HFPP77uiPOGM9bgMVdkt3OY85tDQiHVhi8CMkbh0y/iwpTo2R6UJu	{5000}	t	2022-08-03 15:14:07	2022-10-04 11:05:32
182	Smeko	smekk@abv.bg	$2b$10$15dR58X4nsaB9mL6oxN7rOF00UtF6b7PN4s2FhV71Mz7Fk/cPiPqC	{2000}	t	2022-10-04 16:12:21	2022-10-04 16:12:38
\.


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iliyan
--

SELECT pg_catalog.setval('public.posts_id_seq', 25, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iliyan
--

SELECT pg_catalog.setval('public.users_id_seq', 182, true);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: iliyan
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: posts posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: iliyan
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key UNIQUE (slug);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: iliyan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: iliyan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_unique_lower_email_idx; Type: INDEX; Schema: public; Owner: iliyan
--

CREATE UNIQUE INDEX users_unique_lower_email_idx ON public.users USING btree (lower((email)::text));


--
-- Name: posts set_updated_at_posts; Type: TRIGGER; Schema: public; Owner: iliyan
--

CREATE TRIGGER set_updated_at_posts BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: users set_updated_at_posts; Type: TRIGGER; Schema: public; Owner: iliyan
--

CREATE TRIGGER set_updated_at_posts BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- PostgreSQL database dump complete
--

