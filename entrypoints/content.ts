import wandIcon from "~/assets/wandIcon.svg";
import genIcon from "../assets/generate.svg";
import reGenIcon from "../assets/regenerate.svg";
import downArrowIcon from "~/assets/downArrow.svg";
import "./popup/App.css";
import "./popup/globals.css";

export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
  main() {
    // Modal HTML structure
    const modalHtml = `
  <div id="custom-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden justify-center items-center z-40">
    <div id="modal-content" class="bg-white rounded-lg w-full max-w-[570px] p-5">
      <div id="messages" class="mt-2 max-h-[200px] overflow-y-auto p-2 flex flex-col"></div>
      <div class="mb-2">
        <input id="input-text" type="text" placeholder="Enter your prompt..." class="w-full p-2 border border-gray-300 rounded" />
      </div>
      <div class="text-right align-middle mt-3">
        <button id="insert-btn"class="bg-gray-200 text-gray-500 py-2 px-4 rounded cursor-pointer hidden mr-2.5">
        <span class="flex"><img src="${downArrowIcon}" alt="Insert" class="align-center pr-[5px]">Insert</span>
        </button>
        <button id="generate-btn" class="bg-blue-600 text-white py-2 px-4 border-2 border-blue-600 rounded cursor-pointer">
        <span class="flex"><img src="${genIcon}" alt="Generate" class="align-center pr-[5px]">Generate</span></button>
      </div>
    </div>
  </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHtml);

    //getting elements for DOM manipulate

    const modal = document.getElementById("custom-modal") as HTMLDivElement;
    const modalContent = document.getElementById("modal-content") as HTMLDivElement;
    const generateBtn = document.getElementById("generate-btn") as HTMLButtonElement;
    const insertBtn = document.getElementById("insert-btn") as HTMLButtonElement;
    const inputText = document.getElementById("input-text") as HTMLInputElement;
    const messagesDiv = document.getElementById("messages") as HTMLDivElement;

    const messages = "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask."

    let parentElement: HTMLElement | null = null;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches(".msg-form__contenteditable") || target.matches(".msg-form__contenteditable > p")) {
        handleEditIcon(target);
      } else if (!modal.classList.contains("hidden") && !modalContent.contains(target) && !target.classList.contains("img-append")) {
        closeModal();
      }
    };

    // this listens click in web page after it moves to function

    document.addEventListener("click", handleClick);

    //Here Icon is generated in Input field

    const handleEditIcon = (target: HTMLElement) => {
      parentElement = target.closest(".msg-form__contenteditable");
      console.log(parentElement);
      if (parentElement && !parentElement.querySelector(".img-append")) {
        const icon = createIcon();
        parentElement.appendChild(icon);
        icon.addEventListener("click", (e) => {
          e.stopPropagation();
          //after click modal get displayed
          modal.classList.remove("hidden");
          modal.classList.add("flex");
        });
      }
    };

    //Icon is created
    const createIcon = () => {
      const icon = document.createElement("img");
      icon.src = wandIcon;
      icon.alt = "Edit";
      icon.className = "img-append";
      return icon;
    };

    //this function close modal

    const closeModal = () => {
      generateBtn.innerHTML = `<span class="flex"><img src="${genIcon}" alt="Generate" class="align-center pr-[5px]">Generate</span>`;
      modal.classList.remove("flex");
      modal.classList.add("hidden");
      insertBtn.classList.add("hidden");
    };

    // here it listen click in generate button then it passes to message generator
    generateBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const inputValue = inputText.value.trim();
      if (!inputValue) {
        alert("Please fill the input");
        return;
      }
      generateBtn.disabled = true;
      generateBtn.textContent = "Loading...";
      generateBtn.style.backgroundColor = "#666D80"; // Disable button visually
      generateMessage();
    });

    //this function will generate the message
    const generateMessage = () => {
      const inputValue = inputText.value.trim();
      addMessage(inputValue, "#d4d5d6", "right");
      setTimeout(() => {
        addMessage(messages, "#c5d6e0", "left");
        updateGenerateButton();
        inputText.value = "";
        insertBtn.classList.remove("hidden");
        insertBtn.classList.add("inline-block"); // Show insert button
      }, 500);
    };

    const addMessage = (message: string, bgColor: string, align: string) => {
      const messageDiv = document.createElement("div");
      messageDiv.textContent = message;
      Object.assign(messageDiv.style, {
        backgroundColor: bgColor,
        color: "#666D80",
        borderRadius: "12px",
        padding: "10px",
        marginBottom: "5px",
        textAlign: align,
        maxWidth: "80%",
        alignSelf: align === "right" ? "flex-end" : "flex-start",
        marginLeft: align === "right" ? "auto" : "0",
      });
      messagesDiv.appendChild(messageDiv);
      messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom
    };

    // Regemerate button is created 

    const updateGenerateButton = () => {
      generateBtn.disabled = false; // Re-enable the button
      generateBtn.style.backgroundColor = "#007bff"; // Set background color
      generateBtn.innerHTML = `<span class="flex"><img src="${reGenIcon}" alt="Regenerate" class="align-center pr-[5px]">Regenerate</span>`;
    };

    insertBtn.addEventListener("click", () => {
      insertGeneratedMessage();
    });

    //insert button add the message to message input of linkdein and closes

    const insertGeneratedMessage = () => {
      if (messages && parentElement) {
        const messagePara= document.createElement("p");
        messagePara.textContent = messages;
        parentElement.appendChild(messagePara);
        insertBtn.classList.remove("inline-block");
        closeModal();
      }
    };
  },
});
