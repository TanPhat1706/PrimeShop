import React from "react";
import "../assets/css/about.css";

const PageAbout: React.FC = () => {
  return (
    <div className="about-container">
      {/* Section 1: Tiêu đề */}
      <section className="about-header">
        <h1>Giới Thiệu Về PrimeShop</h1>
        <p className="subtitle">Khám phá câu chuyện và giá trị của chúng tôi</p>
      </section>

      {/* Section 2: Giới thiệu chung */}
      <section className="about-intro">
        <h2>Về Chúng Tôi</h2>
        <p>
          Chào mừng bạn đến với PrimeShop! Chúng tôi là một trong những hệ thống bán lẻ công nghệ hàng đầu tại Việt Nam, chuyên cung cấp các sản phẩm công nghệ chính hãng từ những thương hiệu nổi tiếng như Apple, Samsung, Xiaomi, và nhiều hơn nữa. Với sứ mệnh mang đến trải nghiệm mua sắm tiện lợi và đáng tin cậy, PrimeShop cam kết mang đến cho khách hàng những sản phẩm chất lượng cao với giá cả cạnh tranh.
        </p>
        <p>
          Thành lập vào năm 2015, PrimeShop đã không ngừng phát triển với hơn 50 cửa hàng trên toàn quốc và đội ngũ nhân viên tận tâm. Chúng tôi tự hào là người bạn đồng hành của hàng triệu khách hàng trong hành trình khám phá công nghệ hiện đại.
        </p>
      </section>

      {/* Section 3: Sứ mệnh */}
      <section className="about-mission">
        <h2>Sứ Mệnh</h2>
        <p>
          Sứ mệnh của PrimeShop là mang công nghệ tiên tiến đến gần hơn với mọi người, giúp khách hàng nâng cao chất lượng cuộc sống thông qua các sản phẩm và dịch vụ chất lượng. Chúng tôi cam kết:
        </p>
        <ul>
          <li>Cung cấp sản phẩm chính hãng với giá cả hợp lý.</li>
          <li>Tư vấn tận tâm và dịch vụ hậu mãi chu đáo.</li>
          <li>Đóng góp vào sự phát triển bền vững của cộng đồng.</li>
        </ul>
      </section>

      {/* Section 4: Giá trị cốt lõi */}
      <section className="about-values">
        <h2>Giá Trị Cốt Lõi</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Chất Lượng</h3>
            <p>Cam kết chỉ cung cấp sản phẩm đạt tiêu chuẩn cao nhất.</p>
          </div>
          <div className="value-card">
            <h3>Tận Tâm</h3>
            <p>Đặt khách hàng làm trung tâm trong mọi hoạt động.</p>
          </div>
          <div className="value-card">
            <h3>Đổi Mới</h3>
            <p>Luôn tiên phong ứng dụng công nghệ mới nhất.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageAbout;