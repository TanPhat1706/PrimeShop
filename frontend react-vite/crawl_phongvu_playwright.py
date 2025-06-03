from playwright.sync_api import sync_playwright
import json

def crawl_phongvu_laptops(pages=3):
    products = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        for i in range(1, pages + 1):
            print(f"🌀 Crawling page {i}...")
            page.goto(f"https://phongvu.vn/laptop?pv_medium=m_menu&page={i}")
            page.wait_for_timeout(3000)  # đợi load

            items = page.query_selector_all('div.css-1kxonj9')  # card sản phẩm
            if not items:
                print("⛔ Không tìm thấy sản phẩm.")
                break

            for item in items:
                try:
                    name = item.query_selector('p.css-1f2quy8')  # tên
                    price = item.query_selector('p.css-rhd610')  # giá
                    image = item.query_selector('img')

                    products.append({
                        "name": name.inner_text().strip() if name else "",
                        "price": price.inner_text().strip() if price else "",
                        "image": image.get_attribute("src") if image else ""
                    })
                except Exception as e:
                    print(f"❌ Error: {e}")

        browser.close()
    return products

def save_to_json(data, filename='products_phongvu.json'):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ Đã lưu {len(data)} sản phẩm vào {filename}")

def save_to_txt(data, filename='products_phongvu.txt'):
    with open(filename, 'w', encoding='utf-8') as f:
        for p in data:
            f.write(f"{p['name']} - {p['price']}\n")
    print(f"✅ Đã lưu danh sách sản phẩm vào {filename}")

# --- Main ---
if __name__ == "__main__":
    products = crawl_phongvu_laptops(pages=3)
    save_to_json(products)
    save_to_txt(products)
