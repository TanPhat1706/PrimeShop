import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
// import "../../pages/news/news.css";
import "../../pages/news/newsDetail.css";
import { News } from "../../types/news";
import api from "../../api/api";
interface NewsItem {
  id: number;
  title: string;
  imageUrl: string | null;
  excerpt: string;
  createdAt: string;
  textUrl: string;
}

const NewsDetail2: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchNewsDetail = async () => {
      try {
        const newsId = Number(id);
        // if (isNaN(newsId)) {
        //   throw new Error("ID không hợp lệ.");
        // }

        const data = await api.get(`/news/${id}`);
        console.log("Response:", data.data);
        setNews(data.data);
        console.log("Chi tiết tin tức:", news);
        if (isMounted) {
          setNews(data.data);
          if (data.data.textUrl) {
            const response = await fetch(data.data.textUrl);
            console.log("Response:", response);
            if (!response.ok) throw new Error("Không thể tải nội dung từ textUrl.");
            const html = await response.text();
            const sanitizedHtml = DOMPurify.sanitize(html, {
              USE_PROFILES: { html: true },
              FORBID_TAGS: ['script', 'iframe'],
            });
            setHtmlContent(sanitizedHtml);
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          const errorMessage = err.response?.data?.message || err.message || "Không thể tải chi tiết tin tức.";
          setError(errorMessage);
          setLoading(false);
        }
      }
    };

    fetchNewsDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="news-detail-container">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="news-detail-container">
        <p className="error-message">{error}</p>
        <Link to="/news" className="back-button">
          Quay lại
        </Link>
      </div>
    );
  }

  // if (!news) {
  //   return (
  //     <div className="news-detail-container">
  //       <p className="not-found-message">Không tìm thấy tin tức</p>
  //       <Link to="/news" className="back-button">
  //         Quay lại
  //       </Link>
  //     </div>
  //   );
  // }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
  };

  return (
    <div className="news-detail-container">
      <h1 className="news-detail-title">{news?.title}</h1>
      <div className="news-detail-image-wrapper">
        <img
          src={news?.imageUrl || "https://via.placeholder.com/600x400?text=Image+Not+Found"}
          alt={news?.title}
          className="news-detail-image"
          onError={handleImageError}
        />
      </div>
      <div className="news-detail-content-wrapper">
        <p className="news-detail-excerpt">{news?.excerpt}</p>
        <div className="news-detail-content">
          {htmlContent ? (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : (
            <p>Không có nội dung chi tiết để hiển thị.</p>
          )}
        </div>
      </div>
      <p className="news-detail-date">
        🗓{" "}
        {new Date(news?.publishedAt || "").toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </p>
      <Link to="/news" className="back-button">
        Quay lại
      </Link>
    </div>
  );
};

export default NewsDetail2;